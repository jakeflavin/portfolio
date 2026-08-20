/**
 * Visual regression guard for the styled-components migration.
 *
 * Moving a stylesheet into components cannot break a type check and will not fail a unit
 * test — the only thing that catches it is looking at the result. This builds an app,
 * serves its own dist, and photographs every state in visual-states.json at two viewports
 * in both themes. Run it once to record a baseline, migrate, then run it again: any pixel
 * that moved is reported, with a diff image showing where.
 *
 * Baselines live outside git. Font rasterisation differs between machines, so a committed
 * baseline would fail on any other one — this is a before-and-after tool for the person
 * doing the work, not a CI gate.
 *
 *   node scripts/visual-check.mjs --app apps/noise --slug hush --baseline
 *   node scripts/visual-check.mjs --app apps/noise --slug hush
 *
 *   --baseline   record, rather than compare
 *   --fixtures   let the app reach the network, and save what it fetches for replay
 *   --threshold  per-pixel colour tolerance, 0–1        (default 0.1)
 *   --allow      pixels that may differ before failing  (default 0)
 *   --port       preview port                           (default 4488)
 */
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "visual-states.json"), "utf8"));

const flags = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (!argv[i].startsWith("--")) continue;
  const key = argv[i].slice(2);
  const next = argv[i + 1];
  if (next && !next.startsWith("--")) { flags[key] = next; i++; } else flags[key] = true;
}

const slug = flags.slug;
const appDir = path.resolve(ROOT, flags.app ?? "");
if (!slug || !flags.app) {
  console.error("Usage: node scripts/visual-check.mjs --app <dir> --slug <slug> [--baseline]");
  process.exit(1);
}

const app = CONFIG.apps[slug];
if (!app) { console.error(`No states declared for "${slug}" in visual-states.json`); process.exit(1); }

const PORT = Number(flags.port ?? 4488);
const THRESHOLD = Number(flags.threshold ?? 0.1);
/*
 * Zero everywhere except where an app declares otherwise. weather masks its air-quality
 * section, and the mask rectangle's own edge lands a pixel differently between loads —
 * a few dozen pixels of jitter that no migration could cause.
 */
const ALLOW = Number(flags.allow ?? app.allow ?? 0);
const shotsDir = path.join(ROOT, ".visual", slug, flags.baseline ? "baseline" : "current");
const baseDir = path.join(ROOT, ".visual", slug, "baseline");
const diffDir = path.join(ROOT, ".visual", slug, "diff");
const fixtureDir = path.join(ROOT, ".visual", slug, "fixtures");

const previewDir = path.resolve(appDir, app.previewDir ?? ".");

async function waitForServer(url, timeoutMs = 40_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try { if ((await fetch(url, { redirect: "follow" })).ok) return; } catch { /* not up */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Preview server never became ready at ${url}`);
}

/**
 * Themes are stored differently per app — some keep a whole settings object, some just the
 * value — so the key and its shape are declared alongside the states.
 */
function themeScript(app, theme) {
  const { themeKey: key, themeShape: shape, themeField: field = "theme" } = app;
  if (!key) return null;
  /*
   * Three shapes, because the apps store a theme three ways: inside a settings object, as
   * a JSON-encoded string, or as the bare word. fibo reads the bare word — written quoted,
   * its comparison silently fails and every "light" screenshot comes out dark.
   */
  const value =
    shape === "settings"
      ? `JSON.stringify(Object.assign(JSON.parse(localStorage.getItem(${JSON.stringify(key)}) || '{}'), { ${JSON.stringify(field)}: ${JSON.stringify(theme)} }))`
      : shape === "raw"
        ? JSON.stringify(theme)
        : JSON.stringify(JSON.stringify(theme));
  return `localStorage.setItem(${JSON.stringify(key)}, ${value})`;
}

/** Fixtures are keyed by the exact URL, which a pinned clock keeps stable run to run. */
function fixturePath(url) {
  return path.join(fixtureDir, createHash("sha1").update(url).digest("hex").slice(0, 16) + ".json");
}

/** A 1x1 transparent PNG, standing in for every remote image an offline app asks for. */
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

console.log(`\n${flags.baseline ? "Recording baseline" : "Checking"} ${slug}`);
console.log("  Building");
/*
 * An app can ask to be built differently for the guard. linkit points at the Firestore
 * emulator, because a board fed by the live database photographs differently every run.
 */
execFileSync("npm", ["run", "build"], {
  cwd: appDir,
  stdio: "ignore",
  env: { ...process.env, ...(app.env ?? {}) },
});

console.log(`  Serving on :${PORT}`);
const preview = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"],
  { cwd: previewDir, stdio: "ignore", detached: true });

let browser;
let failures = 0;
let captured = 0;
try {
  const base = `http://localhost:${PORT}/${slug}/`;
  await waitForServer(base);
  browser = await chromium.launch();
  fs.mkdirSync(shotsDir, { recursive: true });

  /*
   * An app whose themes are not light and dark says so. countdown picks between gradient
   * scenes, and photographing it twice under a colour scheme it does not read would have
   * produced two identical images and covered half as much.
   */
  const themes = app.themes ?? CONFIG.defaults.themes;

  /*
   * An app may photograph at its own widths. weather's header chips sit exactly on a
   * flex-wrap boundary at 1280, and the scrollbar arriving once the charts render is
   * enough to tip it — the same build photographs two different layouts. Widening the
   * shot moves it off the knife edge; it does not paper over anything, because a
   * migration that changed the wrap would still show at the width chosen here.
   */
  for (const viewport of app.viewports ?? CONFIG.defaults.viewports) {
    for (const theme of themes) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        colorScheme: app.themes ? "light" : theme,
        reducedMotion: "reduce",
      });
      for (const screen of app.screens) {
        const page = await context.newPage();

        /*
         * An app that renders a relative time, or ranks by age, reads the clock on every
         * render and so photographs differently every run. Pinning it makes those apps
         * comparable at all; the rest never notice.
         */
        if (app.clock) await page.clock.setFixedTime(new Date(app.clock));

        /*
         * Anything off this machine is a source of drift: a remote thumbnail may be slow,
         * may have changed, or may not resolve at all. Images become one fixed pixel so
         * the loaded-image path is still exercised, and every other outside call fails.
         */
        /*
         * An app fed by an API photographs differently every run — a forecast is a
         * different forecast an hour later. Recorded once and replayed after, the same
         * request always answers the same way. Everything is recorded, fonts included:
         * a blocked webfont falls back to different metrics depending on when the block
         * lands, which was enough to make a chart's axis labels come and go between runs.
         *
         * Recording needs the clock pinned too, or the URLs carry today's date and never
         * match again.
         */
        if (app.fixtures && !flags.fixtures) {
          await page.route((url) => !url.hostname.match(/^(localhost|127\.0\.0\.1)$/), (route) => {
            const file = fixturePath(route.request().url());
            if (fs.existsSync(file)) {
              const saved = JSON.parse(fs.readFileSync(file, "utf8"));
              return route.fulfill({
                status: saved.status,
                contentType: saved.type,
                body: Buffer.from(saved.body, "base64"),
              });
            }
            return route.request().resourceType() === "image"
              ? route.fulfill({ contentType: "image/png", body: PIXEL })
              : route.abort();
          });
        } else if (app.fixtures && flags.fixtures) {
          page.on("response", async (response) => {
            const url = response.url();
            if (/^https?:\/\/(localhost|127\.0\.0\.1)/.test(url)) return;
            try {
              const body = await response.body();
              fs.mkdirSync(fixtureDir, { recursive: true });
              fs.writeFileSync(fixturePath(url), JSON.stringify({
                url,
                status: response.status(),
                type: response.headers()["content-type"] ?? "application/octet-stream",
                body: body.toString("base64"),
              }));
            } catch { /* a response that cannot be read is one the replay will abort */ }
          });
        }

        /*
         * Only when nothing else is routing: Playwright runs the most recently registered
         * handler first, so a second one here would abort the requests the fixtures answer.
         */
        if (app.offline && !app.fixtures) {
          await page.route((url) => !url.hostname.match(/^(localhost|127\.0\.0\.1)$/), (route) =>
            route.request().resourceType() === "image"
              ? route.fulfill({ contentType: "image/png", body: PIXEL })
              : route.abort(),
          );
        }

        const url = base + (screen.path ?? "") + (app.query ?? "");
        await page.goto(url, { waitUntil: "domcontentloaded" });

        /*
         * Seeded before the theme so both land in one reload. Some screens only exist once
         * the app has something stored — a saved story, a past session — and those are
         * exactly the screens a migration is most likely to break unnoticed.
         */
        const seeds = { ...(app.seed ?? {}), ...(screen.seed ?? {}) };
        for (const [key, value] of Object.entries(seeds)) {
          await page.evaluate(
            ([k, v]) => localStorage.setItem(k, v),
            [key, typeof value === "string" ? value : JSON.stringify(value)],
          );
        }
        const script = themeScript(app, theme);
        if (script) await page.evaluate(script);
        if (script || Object.keys(seeds).length) await page.reload({ waitUntil: "domcontentloaded" });

        await page.waitForTimeout(screen.wait ?? CONFIG.defaults.wait);
        for (const action of screen.actions ?? []) {
          if (action.click) await page.locator(action.click).first().click().catch(() => {});
          if (action.clickText) await page.getByText(action.clickText, { exact: true }).first().click().catch(() => {});
          /*
           * An app whose interesting screens only exist once something has been opened
           * needs that something. runify's whole analysis side is behind a file input,
           * so the guard hands it a synthetic run rather than leaving it unphotographed.
           */
          if (action.upload) {
            await page.locator(action.upload).first()
              .setInputFiles(path.join(ROOT, action.upload_file))
              .catch(() => {});
          }
          if (action.wait) await page.waitForTimeout(action.wait);
        }
        /*
         * A webfont that arrives after layout reflows every line by a fraction, which
         * lights up every glyph edge in the diff while looking identical to the eye.
         * Waiting for the faces to settle is what makes text comparable at all.
         */
        await page.evaluate(() => document.fonts.ready).catch(() => {});

        // Animations are disabled above, but a transition mid-flight still moves pixels.
        await page.waitForTimeout(400);

        const name = `${screen.name}-${viewport.name}-${theme}.png`;
        /*
         * Some elements are not reproducible and are not this migration's business.
         * Recharts decides per render whether the last axis label fits, so the same build
         * photographs it present or absent; masking the tick text makes the rest of the
         * chart comparable at zero tolerance. The axis line and tick marks, which the
         * stylesheet does style, stay visible.
         */
        const buffer = await page.screenshot({
          fullPage: true,
          mask: (app.mask ?? []).map((selector) => page.locator(selector)),
          maskColor: "#ff00ff",
        });
        fs.writeFileSync(path.join(shotsDir, name), buffer);
        captured++;
        await page.close();

        if (flags.baseline) { console.log(`  recorded ${name}`); continue; }

        const basePath = path.join(baseDir, name);
        if (!fs.existsSync(basePath)) { console.log(`  ?  ${name} — no baseline`); continue; }

        const before = PNG.sync.read(fs.readFileSync(basePath));
        const after = PNG.sync.read(buffer);
        if (before.width !== after.width || before.height !== after.height) {
          console.log(`  ✗  ${name} — size changed ${before.width}x${before.height} -> ${after.width}x${after.height}`);
          failures++;
          continue;
        }
        const diff = new PNG({ width: before.width, height: before.height });
        const changed = pixelmatch(before.data, after.data, diff.data, before.width, before.height, { threshold: THRESHOLD });
        if (changed > ALLOW) {
          fs.mkdirSync(diffDir, { recursive: true });
          fs.writeFileSync(path.join(diffDir, name), PNG.sync.write(diff));
          const pct = ((changed / (before.width * before.height)) * 100).toFixed(3);
          console.log(`  ✗  ${name} — ${changed} pixels (${pct}%)  diff: .visual/${slug}/diff/${name}`);
          failures++;
        } else {
          console.log(`  ✓  ${name}`);
        }
      }
      await context.close();
    }
  }
} finally {
  if (browser) await browser.close();
  try { process.kill(-preview.pid); } catch { preview.kill(); }
}

if (flags.baseline) {
  console.log(`\n  Baseline recorded: ${captured} states in .visual/${slug}/baseline\n`);
} else if (failures) {
  console.error(`\n  ${failures} of ${captured} states changed.\n`);
  process.exit(1);
} else {
  console.log(`\n  All ${captured} states unchanged.\n`);
}
