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
 *   --threshold  per-pixel colour tolerance, 0–1        (default 0.1)
 *   --allow      pixels that may differ before failing  (default 0)
 *   --port       preview port                           (default 4488)
 */
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
const ALLOW = Number(flags.allow ?? 0);
const shotsDir = path.join(ROOT, ".visual", slug, flags.baseline ? "baseline" : "current");
const baseDir = path.join(ROOT, ".visual", slug, "baseline");
const diffDir = path.join(ROOT, ".visual", slug, "diff");

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
function themeScript(key, shape, theme) {
  if (!key) return null;
  const value = shape === "settings"
    ? `JSON.stringify(Object.assign(JSON.parse(localStorage.getItem(${JSON.stringify(key)}) || '{}'), { theme: ${JSON.stringify(theme)} }))`
    : JSON.stringify(JSON.stringify(theme));
  return `localStorage.setItem(${JSON.stringify(key)}, ${value})`;
}

console.log(`\n${flags.baseline ? "Recording baseline" : "Checking"} ${slug}`);
console.log("  Building");
execFileSync("npm", ["run", "build"], { cwd: appDir, stdio: "ignore" });

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

  for (const viewport of CONFIG.defaults.viewports) {
    for (const theme of CONFIG.defaults.themes) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      for (const screen of app.screens) {
        const page = await context.newPage();
        const url = base + (app.query ?? "");
        await page.goto(url, { waitUntil: "domcontentloaded" });

        const script = themeScript(app.themeKey, app.themeShape, theme);
        if (script) { await page.evaluate(script); await page.reload({ waitUntil: "domcontentloaded" }); }

        await page.waitForTimeout(screen.wait ?? CONFIG.defaults.wait);
        for (const action of screen.actions ?? []) {
          if (action.click) await page.locator(action.click).first().click().catch(() => {});
          if (action.clickText) await page.getByText(action.clickText, { exact: true }).first().click().catch(() => {});
          if (action.wait) await page.waitForTimeout(action.wait);
        }
        // Animations are disabled above, but a transition mid-flight still moves pixels.
        await page.waitForTimeout(400);

        const name = `${screen.name}-${viewport.name}-${theme}.png`;
        const buffer = await page.screenshot({ fullPage: true });
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
