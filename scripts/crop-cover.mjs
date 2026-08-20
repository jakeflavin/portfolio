#!/usr/bin/env node
/**
 * Cuts a square cover out of a screenshot taken by hand.
 *
 * `capture-cover.mjs` drives the app itself, which is right when the framing can be
 * described in a config. When it cannot - the shot needs a route someone drew, a room
 * someone filled, a moment - the screenshot comes from a person and this cuts it down.
 *
 * The source lives in `assets/covers/<slug>.png` and is committed, so a cover can be
 * recropped later without going back to the app for another screenshot. The crop lives in
 * apps.json under the entry's `crop` key, so the same square comes back in any session.
 *
 * Usage:
 *   node scripts/crop-cover.mjs <slug>                       # uses the entry's `crop`
 *   node scripts/crop-cover.mjs <slug> --x 0 --y 0 --size 1160
 *
 * Options:
 *   --x, --y     Top-left of the square, in the source's own pixels  (default: centred)
 *   --size       Edge length in source pixels                        (default: the short side)
 *   --out        Output file    (default: public/images/<slug>-cover.jpg)
 *   --src        Source file    (default: assets/covers/<slug>.png)
 *   --width      Output width; the crop is scaled to it              (default: 1080)
 *   --save       Write the crop back to apps.json so it reproduces
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = path.resolve(import.meta.dirname, "..");

const argv = process.argv.slice(2);
const slug = argv.find((a) => !a.startsWith("--"));
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);

if (!slug) {
  console.error("Usage: node scripts/crop-cover.mjs <slug> [--x n --y n --size n] [--save]");
  process.exit(1);
}

const manifestPath = path.join(ROOT, "apps.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const entry = manifest.apps.find((app) => app.slug === slug);
if (!entry) {
  console.error(`No app named ${slug} in apps.json`);
  process.exit(1);
}

const src = path.resolve(ROOT, flag("src") ?? `assets/covers/${slug}.png`);
if (!fs.existsSync(src)) {
  console.error(`No source at ${path.relative(ROOT, src)}. Put the screenshot there first.`);
  process.exit(1);
}

const outPath = path.resolve(ROOT, flag("out") ?? `public/images/${slug}-cover.jpg`);
const WIDTH = Number(flag("width") ?? 1080);

const stored = entry.crop ?? {};
const wanted = {
  x: flag("x") !== undefined ? Number(flag("x")) : stored.x,
  y: flag("y") !== undefined ? Number(flag("y")) : stored.y,
  size: flag("size") !== undefined ? Number(flag("size")) : stored.size,
};

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const dataUrl = `data:image/png;base64,${fs.readFileSync(src).toString("base64")}`;

  const result = await page.evaluate(
    async ({ dataUrl, wanted, width }) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();

      // Defaults to the biggest square the source holds, centred.
      const size = wanted.size ?? Math.min(image.width, image.height);
      const clamp = (value, max) => Math.max(0, Math.min(Math.round(value), max - size));
      const x = clamp(wanted.x ?? (image.width - size) / 2, image.width);
      const y = clamp(wanted.y ?? (image.height - size) / 2, image.height);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = width;
      const context = canvas.getContext("2d");
      context.imageSmoothingQuality = "high";
      context.drawImage(image, x, y, size, size, 0, 0, width, width);

      return {
        jpeg: canvas.toDataURL("image/jpeg", 0.86).split(",")[1],
        source: `${image.width}x${image.height}`,
        crop: { x, y, size },
      };
    },
    { dataUrl, wanted, width: WIDTH },
  );

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(result.jpeg, "base64"));

  if (has("save")) {
    entry.crop = result.crop;
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }

  const kb = Math.round(fs.statSync(outPath).size / 1024);
  const { x, y, size } = result.crop;
  console.log(
    `  ${path.relative(ROOT, outPath)}: ${size}px square at ${x},${y} of ${result.source} -> ${WIDTH}px (${kb} KB)`,
  );
} finally {
  await browser.close();
}
