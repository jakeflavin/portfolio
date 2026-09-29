/**
 * Frames a raw screen (assets/covers/<slug>.png) as a cover with bezl.
 *
 *   node scripts/bezl-cover.mjs <slug>             # a web app: Safari window
 *   node scripts/bezl-cover.mjs <slug> --phone     # an iOS app: iPhone
 *   node scripts/bezl-cover.mjs <slug> --color '#4A42A9'
 *
 * The canvas is a 1080 square with one solid colour, drawn at random from the five stops of
 * the site's gradient (brandStops in src/styles/themes.js). The colour is kept in the bezl
 * document, so a re-run reuses it; `--color` or `--reroll` changes it. The window or phone
 * is centred both ways and sized from the raw screen's own shape, so a wide screen gives a
 * wide window and nothing is cropped.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const STOPS = ["#2244D8", "#4A42A9", "#72407A", "#9B3E4B", "#C33C1C"];
const CANVAS = 1080;
/** Safari's title and address bar, in canvas pixels, at the window sizes used here. */
const CHROME = 46;
/** The window's share of the canvas width; the margin either side is what is left. */
const WIDTH_SHARE = 0.84;
/** The one screen shape every web cover uses, so every window is the same size. */
const SCREEN_ASPECT = 1.6;
const PHONE_HEIGHT = 0.8;

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : (args[i + 1] ?? true);
};
if (!slug) {
  console.error("Usage: node scripts/bezl-cover.mjs <slug> [--phone] [--color #hex] [--reroll]");
  process.exit(1);
}

const raw = path.join(ROOT, "assets/covers", `${slug}.png`);
const docPath = path.join(ROOT, ".bezl", `${slug}-cover.json`);
if (!fs.existsSync(raw)) {
  console.error(`No raw screen at ${path.relative(ROOT, raw)}`);
  process.exit(1);
}

/** PNG width and height come straight from the IHDR chunk. */
const png = fs.readFileSync(raw);
const [w, h] = [png.readUInt32BE(16), png.readUInt32BE(20)];

const saved = fs.existsSync(docPath) ? JSON.parse(fs.readFileSync(docPath, "utf8")).background : null;
const color =
  flag("color") ??
  (!flag("reroll") && typeof saved === "string" && STOPS.includes(saved.toUpperCase()) ? saved : null) ??
  STOPS[Math.floor(Math.random() * STOPS.length)];

if (!flag("phone") && Math.abs(w / h / SCREEN_ASPECT - 1) > 0.01) {
  console.error(`${slug}: the raw is ${w}x${h} (${(w / h).toFixed(3)}). Web covers use 16:10, so the windows match.`);
  process.exit(1);
}

const layer = flag("phone")
  ? ["model=iphone-18-pro", `height=${PHONE_HEIGHT}`]
  : (() => {
      const height = ((CANVAS * WIDTH_SHARE) / SCREEN_ASPECT + CHROME) / CANVAS;
      return [
        "model=none",
        "window=safari",
        `window.url=portfolio-4b9fe.web.app/${slug}`,
        "window.theme=dark",
        `height=${height.toFixed(3)}`,
      ];
    })();

const out = execFileSync(
  "npx",
  [
    "--yes",
    "@jakeflavin/bezl@0.3.0",
    "image",
    raw,
    ...layer,
    "x=0.5",
    "y=0.5",
    "-c",
    `${CANVAS}x${CANVAS}`,
    "-b",
    color,
    "-o",
    path.join(ROOT, `public/images/${slug}-cover.jpg`),
    "--save",
    `${slug}-cover`,
    "--json",
  ],
  { cwd: ROOT, encoding: "utf8" }
);
const result = JSON.parse(out.trim().split("\n").pop());
console.log(`${slug}: ${color} ${w}x${h} ${result.ok ? "ok" : JSON.stringify(result)} ${(result.warnings ?? []).join("; ")}`);
