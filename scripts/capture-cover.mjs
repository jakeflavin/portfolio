/**
 * Captures a card cover by screenshotting the app itself.
 *
 * Builds the app, serves its own `dist`, drives a headless browser at the card's aspect
 * ratio, hides the app's header/footer chrome, and writes the image into public/images.
 *
 * Serving the local build rather than the live URL means a cover can be captured before the
 * app has ever been deployed — which is the order `add-app.mjs` needs.
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

/** Matches the card's 1:1 media, so the capture lands without cropping. */
const SIZE = Number(flags.size ?? 1080);
const PORT = Number(flags.port ?? 4319);
const WAIT = Number(flags.wait ?? 1500);
const THEME = flags.theme === "dark" ? "dark" : "light";
const HIDE = flags["keep-chrome"]
  ? []
  : (flags.hide ?? "header,footer").split(",").map((s) => s.trim()).filter(Boolean);

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
run("npm", ["run", "build"]);

console.log(`  Serving on :${PORT}`);
const preview = spawn(
  "npx",
  ["vite", "preview", "--port", String(PORT), "--strictPort"],
  { cwd: appDir, stdio: "ignore", detached: true }
);

let browser;
try {
  const url = `http://localhost:${PORT}/${slug}/`;
  await waitForServer(url);

  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: SIZE, height: SIZE },
    colorScheme: THEME,
    // The apps are responsive; a square viewport is an unusual shape, so pin the scale.
    deviceScaleFactor: 1
  });

  await page.goto(url, { waitUntil: "load" });

  if (HIDE.length > 0) {
    // The app's own header carries its name, which duplicates the card's title, so the
    // chrome comes off and the capture shows only what the app does.
    await page.addStyleTag({
      content: `${HIDE.join(", ")} { display: none !important; }`
    });
  }

  // Videos, fonts and entry animations all settle after load.
  await page.waitForTimeout(WAIT);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({
    path: outPath,
    type: outPath.endsWith(".png") ? "png" : "jpeg",
    ...(outPath.endsWith(".png") ? {} : { quality: 88 })
  });

  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`  Wrote ${path.relative(ROOT, outPath)} (${SIZE}x${SIZE}, ${kb} KB)\n`);
} finally {
  await browser?.close();
  // Detached, so kill the group rather than just the npx shim.
  try {
    process.kill(-preview.pid);
  } catch {
    preview.kill();
  }
}
