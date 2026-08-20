/**
 * Captures a card cover by screenshotting the app itself.
 *
 * Builds the app, serves its own `dist`, drives a headless browser at the card's aspect
 * ratio, hides the app's header/footer chrome, and writes the image into public/images.
 *
 * Serving the local build rather than the live URL means a cover can be captured before the
 * app has ever been deployed — which is the order `add-app.mjs` needs.
 *
 * Per-app settings live in apps.json under the entry's `shot` key, so a re-capture in any
 * later session reproduces the same framing without anyone remembering the flags. CLI flags
 * override them.
 *
 * Usage:
 *   node scripts/capture-cover.mjs <path-to-app> --slug <slug> [options]
 *
 * Options:
 *   --slug <slug>      Public path segment; also names the output file  (required)
 *   --out <path>       Output file      (default: public/images/<slug>-cover.jpg)
 *   --hide <selectors> Comma-separated CSS to hide  (default: header,footer)
 *   --wait <ms>        Settle time after load       (default: 1500)
 *   --size <px>        Square edge length           (default: 1080)
 *   --port <port>      Preview server port          (default: 4319)
 *   --theme <scheme>   `light` or `dark`            (default: light)
 *   --keep-chrome      Skip hiding anything
 *   --preview-dir <p>  Where to serve from, for workspace repos (default: the app root)
 *
 * An app that opens empty can record `shot.actions` in apps.json — ordered click/type
 * steps replayed before the shot, so the framing reproduces without anyone remembering it.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawn } from "node:child_process";
import { chromium } from "playwright";

const ROOT = path.resolve(import.meta.dirname, "..");

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    const key = arg.slice(2);
    if (key === "keep-chrome") flags[key] = true;
    else flags[key] = argv[++i];
  }
  return { positional, flags };
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const appDir = positional[0] ? path.resolve(positional[0]) : null;
const slug = flags.slug;

if (!appDir || !slug) {
  console.error(
    "Usage: node scripts/capture-cover.mjs <path-to-app> --slug <slug> [--wait ms] [--hide sel,sel]"
  );
  process.exit(1);
}

/**
 * Defaults recorded against the app in apps.json. Not every app marks its chrome up as
 * `<header>`/`<footer>` — weather's search bar is a plain div — so the selectors that
 * worked get written down rather than rediscovered.
 */
function manifestShot(slugName) {
  const manifestPath = path.join(ROOT, "apps.json");
  if (!fs.existsSync(manifestPath)) return {};
  const { apps = [] } = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  return apps.find((app) => app.slug === slugName)?.shot ?? {};
}

const shot = manifestShot(slug);

/** Matches the card's 1:1 media, so the capture lands without cropping. */
const SIZE = Number(flags.size ?? shot.size ?? 1080);
const PORT = Number(flags.port ?? 4319);
const WAIT = Number(flags.wait ?? shot.wait ?? 1500);
const THEME = (flags.theme ?? shot.theme) === "dark" ? "dark" : "light";
const HIDE = flags["keep-chrome"]
  ? []
  : (flags.hide ?? shot.hide ?? "header,footer")
      .split(",")
      .map((selector) => selector.trim())
      .filter(Boolean);

/**
 * Ordered interaction steps run before the shot. Each is one of `click: [x, y]`,
 * `selector`, `press` or `type`, with an optional `wait` in ms after it.
 */
const ACTIONS = Array.isArray(shot.actions) ? shot.actions : [];

/**
 * Where `vite preview` runs. A workspace repo builds from the root but its output — and
 * the vite config that knows how to serve it — live in the package, so the two commands
 * need different directories.
 */
const previewDir = path.resolve(appDir, flags["preview-dir"] ?? shot.previewDir ?? ".");

/**
 * The shape the app is rendered at. A real width, not the cover's square.
 */
const VIEWPORT = shot.viewport ?? { width: SIZE, height: SIZE };

/**
 * The square to cut out of that render, in its own coordinates. `size` is the shorthand
 * for a square; `width`/`height` if it ever needs not to be.
 */
const CLIP = shot.clip ?? null;

/**
 * Build-time environment for the app.
 *
 * The same mechanism the visual guard uses: linkit and fibo point at local emulators for a
 * capture, because a cover fed by the live database is a different picture every time and
 * cannot be reproduced.
 */
const ENV = shot.env ?? {};

/**
 * localStorage to write before the app loads, as `{ key: value }`.
 *
 * The same mechanism the visual guard uses. Several of these apps open empty because
 * whatever makes them worth a cover is something the user put in: hat opens on a number
 * until it has a list of names in it. Driving the UI to build that state is slower, more
 * fragile, and reproduces less exactly than writing the state the UI would have written.
 */
const SEED = shot.seed ?? {};

const outPath = path.resolve(ROOT, flags.out ?? `public/images/${slug}-cover.jpg`);

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: appDir,
    stdio: "inherit",
    ...options
  });
}

async function waitForServer(url, timeoutMs = 30_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server never became ready at ${url}`);
}

console.log(`\nCapturing ${slug} from ${appDir}`);

if (!fs.existsSync(path.join(appDir, "node_modules"))) {
  console.log("  Installing dependencies");
  run("npm", ["ci"]);
}

console.log("  Building");
run("npm", ["run", "build"], { env: { ...process.env, ...ENV } });

console.log(`  Serving on :${PORT}`);
const preview = spawn(
  "npx",
  ["vite", "preview", "--port", String(PORT), "--strictPort"],
  { cwd: previewDir, stdio: "ignore", detached: true }
);

let browser;
try {
  const url = `http://localhost:${PORT}/${slug}/`;
  await waitForServer(url);

  browser = await chromium.launch();
  /*
   * The page is rendered at whatever shape shows the app best, and the cover is cut out of
   * that. A square viewport is a shape no app was designed for: a responsive layout meets
   * it at a breakpoint it never expects, so the screenshot shows an arrangement nobody will
   * ever see. Rendering at a real width and clipping a square out of it gives the app as it
   * actually looks.
   */
  const page = await browser.newPage({
    viewport: VIEWPORT,
    colorScheme: THEME,
    // Twice over, so a clipped crop still has pixels to spare.
    deviceScaleFactor: 2
  });

  if (Object.keys(SEED).length > 0) {
    // Before the app's first script, so it reads the seeded state on its first render.
    await page.addInitScript((entries) => {
      for (const [key, value] of entries) {
        window.localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
      }
    }, Object.entries(SEED));
  }

  await page.goto(url, { waitUntil: "load" });

  if (HIDE.length > 0) {
    // The app's own header carries its name, which duplicates the card's title, so the
    // chrome comes off and the capture shows only what the app does.
    await page.addStyleTag({
      content: `${HIDE.join(", ")} { display: none !important; }`
    });
  }

  /*
   * Some apps show nothing worth capturing until they are used — runify opens on an empty
   * world map, and its cover is meaningless without a route on it. The steps live in
   * apps.json so the same cover comes back in any later session.
   */
  for (const action of ACTIONS) {
    if (action.click) {
      const [x, y] = action.click;
      await page.mouse.click(x, y);
    } else if (action.selector) {
      await page.click(action.selector);
    } else if (action.press) {
      await page.keyboard.press(action.press);
    } else if (action.type) {
      await page.keyboard.type(action.type);
    }
    await page.waitForTimeout(action.wait ?? 400);
  }

  // Videos, fonts and entry animations all settle after load.
  await page.waitForTimeout(WAIT);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  /*
   * `clip` names the square to cut, in the rendered page's own coordinates. Without one the
   * whole viewport is taken, which is only square if the viewport was.
   */
  const clip = CLIP
    ? {
        x: CLIP.x ?? 0,
        y: CLIP.y ?? 0,
        width: CLIP.size ?? CLIP.width,
        height: CLIP.size ?? CLIP.height
      }
    : undefined;

  await page.screenshot({
    path: outPath,
    type: outPath.endsWith(".png") ? "png" : "jpeg",
    ...(outPath.endsWith(".png") ? {} : { quality: 88 }),
    ...(clip ? { clip } : {})
  });

  const shape = clip
    ? `${clip.width}x${clip.height} cut from ${VIEWPORT.width}x${VIEWPORT.height}`
    : `${VIEWPORT.width}x${VIEWPORT.height}`;
  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`  Wrote ${path.relative(ROOT, outPath)} (${shape}, ${kb} KB)\n`);
} finally {
  await browser?.close();
  // Detached, so kill the group rather than just the npx shim.
  try {
    process.kill(-preview.pid);
  } catch {
    preview.kill();
  }
}
