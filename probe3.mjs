import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs"; import path from "node:path";
import { PNG } from "pngjs"; import pixelmatch from "pixelmatch";
const PORT = 4584, fixtureDir = ".visual/weather/fixtures";
const preview = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"],
  { cwd: "apps/weather", stdio: "ignore", detached: true });
await new Promise((r) => setTimeout(r, 3000));
const browser = await chromium.launch();
async function shot() {
  const ctx = await browser.newContext({ colorScheme: "light", viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(new Date("2026-08-19T15:00:00Z"));
  await page.route((u) => !u.hostname.match(/^(localhost|127\.0\.0\.1)$/), (route) => {
    const f = path.join(fixtureDir, createHash("sha1").update(route.request().url()).digest("hex").slice(0, 16) + ".json");
    if (fs.existsSync(f)) { const s = JSON.parse(fs.readFileSync(f, "utf8")); return route.fulfill({ status: s.status, contentType: s.type, body: Buffer.from(s.body, "base64") }); }
    return route.abort();
  });
  await page.goto(`http://localhost:${PORT}/weather/?lat=39.74&lon=-104.98&name=Denver`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(9000);
  await page.evaluate(() => document.fonts.ready);
  const a = await page.screenshot({ fullPage: true });
  const b = await page.screenshot({ fullPage: true });
  await ctx.close();
  return [a, b];
}
const [a1, a2] = await shot();
const [b1] = await shot();
function diff(x, y, label) {
  const p1 = PNG.sync.read(x), p2 = PNG.sync.read(y);
  if (p1.width !== p2.width || p1.height !== p2.height) return console.log(`  ${label}: size differs`);
  const out = new PNG({ width: p1.width, height: p1.height });
  const n = pixelmatch(p1.data, p2.data, out.data, p1.width, p1.height, { threshold: 0.1 });
  console.log(`  ${label}: ${n} pixels`);
  if (n) fs.writeFileSync(`/tmp/${label}.png`, PNG.sync.write(out));
}
diff(a1, a2, "same-page-two-shots");
diff(a1, b1, "two-separate-loads");
await browser.close(); process.kill(-preview.pid);
