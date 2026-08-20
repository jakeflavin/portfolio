/**
 * Crops a photograph down to the profile avatar.
 *
 * The avatar renders at 72px on a phone and 120px on a desktop, inside a circle, so the
 * crop does nearly all the work: a whole photograph at that size is a smudge. This takes
 * a square out of the source and exports it at 360px — enough for 3x on either.
 *
 * The framing is a centre point and a span, both as fractions of the source, rather than
 * pixels. A phone photograph and the same shot resized both frame identically, and the
 * numbers stay meaningful if the original is ever replaced with a larger export.
 *
 *   --centre "0.45,0.48"   where the subject's face sits, across and down
 *   --span   0.50          width of the square, as a fraction of the source width
 *
 * A larger span keeps more background; a smaller one crops tighter to the face. The height
 * is derived from the source's own aspect so the crop is square in real pixels, which is
 * the part that is easy to get wrong by hand.
 *
 *   node scripts/make-avatar.mjs <source> [--out public/images/avatar.jpg]
 *                                [--centre "0.45,0.48"] [--span 0.5] [--size 360]
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const [source, ...rest] = process.argv.slice(2);
if (!source) {
  console.error('usage: node scripts/make-avatar.mjs <source> [--centre "x,y"] [--span n]');
  process.exit(2);
}
const flags = {};
for (let i = 0; i < rest.length; i++) if (rest[i].startsWith("--")) flags[rest[i].slice(2)] = rest[i + 1];

const out = path.resolve(flags.out ?? "public/images/avatar.jpg");
const size = Number(flags.size ?? 360);
const span = Number(flags.span ?? 0.5);
const [cx, cy] = (flags.centre ?? flags.center ?? "0.5,0.4").split(",").map(Number);

if (!fs.existsSync(source)) {
  console.error(`no such file: ${source}`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
await page.setContent(
  `<style>
     html, body { margin: 0; width: ${size}px; height: ${size}px; overflow: hidden; background: #000; }
     #frame { position: relative; width: ${size}px; height: ${size}px; overflow: hidden; }
     img { position: absolute; transform-origin: 0 0; }
   </style>
   <div id="frame"><img src="file://${path.resolve(source)}"></div>`,
  { waitUntil: "load" },
);

const framing = await page.evaluate(
  ({ size, span, cx, cy }) => {
    const img = document.querySelector("img");
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    // A square in source pixels, so the crop is not stretched by the source's aspect.
    const side = W * span;
    let x = cx * W - side / 2;
    let y = cy * H - side / 2;
    // Keep the square inside the photograph rather than filling the gap with background.
    x = Math.max(0, Math.min(W - side, x));
    y = Math.max(0, Math.min(H - side, y));
    const scale = size / side;
    img.style.transform = `scale(${scale}) translate(${-x}px, ${-y}px)`;
    return { W, H, side: Math.round(side), x: Math.round(x), y: Math.round(y), clamped: y === 0 || y === H - side };
  },
  { size, span, cx, cy },
);

await page.waitForFunction(() => {
  const img = document.querySelector("img");
  return img?.complete && img.naturalWidth > 0;
});

fs.mkdirSync(path.dirname(out), { recursive: true });
await page.screenshot({
  path: out,
  type: out.endsWith(".png") ? "png" : "jpeg",
  quality: out.endsWith(".png") ? undefined : 86,
});
await browser.close();

console.log(
  `  ${path.relative(process.cwd(), out)}  ${size}x${size}  ` +
    `${(fs.statSync(out).size / 1024).toFixed(1)} kB\n` +
    `  source ${framing.W}x${framing.H} → ${framing.side}px square at (${framing.x}, ${framing.y})` +
    (framing.clamped ? "  [clamped to the edge — try a smaller span]" : ""),
);
