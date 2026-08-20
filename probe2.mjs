import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs"; import path from "node:path";
const PORT = 4583, fixtureDir = ".visual/weather/fixtures";
const preview = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"],
  { cwd: "apps/weather", stdio: "ignore", detached: true });
await new Promise((r) => setTimeout(r, 3000));
const browser = await chromium.launch();
for (let i = 0; i < 4; i++) {
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
  const o = await page.evaluate(() => {
    const pick = (sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return `${r.top.toFixed(2)}/${r.height.toFixed(2)}/${r.width.toFixed(2)}`; };
    return {
      fonts: document.fonts.status,
      loaded: [...document.fonts].filter(f => f.status === "loaded").map(f => f.family + " " + f.weight).join(","),
      hdr: pick("header"), main: pick("main"),
    };
  });
  console.log(`  run ${i}: fonts=${o.fonts} header=${o.hdr} main=${o.main}`);
  console.log(`         faces: ${o.loaded.slice(0, 120)}`);
  await ctx.close();
}
await browser.close(); process.kill(-preview.pid);
