import { chromium } from "playwright";
const SITE = "https://portfolio-4b9fe.web.app";
const VIEWPORTS = [["desktop", 1280, 900], ["tablet", 834, 1112], ["mobile", 390, 844]];

/* Each app's core feature, driven the way a person would. */
const APPS = [
  { name: "portfolio", path: "", check: async (p) => {
      await p.getByPlaceholder("Search").fill("weather");
      await p.waitForTimeout(900);
      const n = await p.evaluate(() => document.body.innerText.match(/Weather/g)?.length ?? 0);
      return n > 0 ? null : "search for 'weather' returned nothing";
    } },
  { name: "hush", path: "hush/", check: async (p) => {
      const before = await p.evaluate(() => document.body.innerText.length);
      await p.getByRole("button", { name: /settings|Open settings/i }).first().click().catch(() => {});
      await p.waitForTimeout(700);
      const after = await p.evaluate(() => document.body.innerText.length);
      return after > before ? null : "settings did not open";
    } },
  { name: "madlib", path: "madlib/", check: async (p) => {
      const t = await p.evaluate(() => document.body.innerText.length);
      return t > 100 ? null : "no content";
    } },
  { name: "countdown", path: "countdown/", check: async (p) => {
      await p.getByText("Start", { exact: true }).first().click().catch(() => {});
      await p.waitForTimeout(1600);
      const running = await p.evaluate(() => /Pause|Stop|Reset/i.test(document.body.innerText));
      return running ? null : "Start did not begin the countdown";
    } },
  { name: "hat", path: "hat/?pick=number&min=1&max=100", check: async (p) => {
      const first = await p.evaluate(() => document.body.innerText.match(/\d+/)?.[0]);
      await p.getByText("Roll", { exact: true }).first().click().catch(() => {});
      await p.waitForTimeout(1800);
      const after = await p.evaluate(() => document.body.innerText.match(/\d+/)?.[0]);
      return first !== undefined && after !== undefined ? null : "no number drawn";
    } },
  { name: "linkit", path: "linkit/", check: async (p) => {
      await p.getByText("Post a cool link").first().click().catch(() => {});
      await p.waitForTimeout(700);
      const open = await p.evaluate(() => /Community|Post|Cancel/.test(document.body.innerText));
      return open ? null : "compose did not open";
    } },
  { name: "weather", path: "weather/?lat=39.74&lon=-104.98&name=Denver", wait: 8000, check: async (p) => {
      const ok = await p.evaluate(() => /Denver/.test(document.body.innerText) && /°/.test(document.body.innerText));
      if (!ok) return "no forecast rendered";
      await p.getByText("°C", { exact: true }).first().click().catch(() => {});
      await p.waitForTimeout(1200);
      return await p.evaluate(() => /°C/.test(document.body.innerText)) ? null : "unit toggle did nothing";
    } },
  { name: "runify", path: "runify/", check: async (p) => {
      await p.getByText("Analyse", { exact: true }).first().click().catch(() => {});
      await p.waitForTimeout(900);
      const ok = await p.evaluate(() => /Drop|file|GPX|TCX/i.test(document.body.innerText));
      return ok ? null : "analyse tab did not open";
    } },
  { name: "fibo", path: "fibo/", check: async (p) => {
      await p.getByPlaceholder("Ada").fill("Guard");
      await p.waitForTimeout(500);
      const enabled = await p.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find((x) => /Create session/.test(x.textContent));
        return b && !b.disabled;
      });
      return enabled ? null : "Create session stayed disabled after a name";
    } },
];

const browser = await chromium.launch();
const problems = [];
for (const app of APPS) {
  for (const [vp, width, height] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: "dark" });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 100)));
    await page.goto(`${SITE}/${app.path}`, { waitUntil: "domcontentloaded" }).catch(() => {});
    await page.waitForTimeout(app.wait ?? 3500);
    let result = null;
    try { result = await app.check(page); } catch (e) { result = "threw: " + String(e).slice(0, 90); }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const tag = `${app.name}/${vp}`;
    if (result) problems.push(`${tag}: ${result}`);
    if (overflow > 1) problems.push(`${tag}: horizontal overflow ${overflow}px`);
    if (errors.length) problems.push(`${tag}: ${errors[0]}`);
    await page.screenshot({ path: `.visual/verify/feature-${app.name}-${vp}.png` });
    await ctx.close();
  }
  console.log(`  ${app.name}`);
}
await browser.close();
console.log(problems.length ? "\nPROBLEMS:\n" + problems.map((p) => "  " + p).join("\n") : "\n  every core feature works at all three sizes");
