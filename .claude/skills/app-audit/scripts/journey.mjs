/**
 * Template for the app-specific pass. Copy into your scratchpad, rename, and
 * rewrite the STEPS for the app you are auditing — the probe handles what can be
 * measured without clicking; this is where you actually use the thing.
 *
 *   node journey.mjs desktop|tablet|mobile
 *
 * Why it's shaped this way:
 *   - each step is wrapped, so one broken selector doesn't lose the whole run —
 *     a failed step is itself a finding, recorded in notes.json
 *   - screenshots are named <viewport>-<nn>-<what>.png so they sort into the
 *     order you walked, which is the order the report tells the story in
 *   - measurements go to notes.json so the numbers in the report are copied,
 *     not remembered
 */
import fs from 'node:fs'
import path from 'node:path'

const BASE = 'https://portfolio-4b9fe.web.app/<slug>/'   // <-- set this
const OUT = './shots'                                     // <-- scratchpad dir

const VPS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  tablet: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2 },
  mobile: null, // filled from devices['iPhone 13'] below
}

let playwrightPath = process.env.PLAYWRIGHT_PATH
if (!playwrightPath) {
  let dir = process.cwd()
  while (dir !== path.dirname(dir)) {
    const c = path.join(dir, 'node_modules/playwright/index.mjs')
    if (fs.existsSync(c)) { playwrightPath = c; break }
    dir = path.dirname(dir)
  }
}
const { chromium, devices } = await import(playwrightPath)
VPS.mobile = { ...devices['iPhone 13'] }

const vp = process.argv[2] ?? 'desktop'
fs.mkdirSync(OUT, { recursive: true })

const notes = {}
const errors = []
const browser = await chromium.launch()
const ctx = await browser.newContext(VPS[vp])
const page = await ctx.newPage()
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

const shot = (name, opts = {}) => page.screenshot({ path: `${OUT}/${vp}-${name}.png`, ...opts })

/** A named step. Failures are recorded, not fatal — you want the rest of the run. */
const step = async (name, fn) => {
  try {
    await fn()
  } catch (e) {
    notes[`FAILED:${name}`] = e.message
    console.log(`  !! ${name}: ${e.message}`)
  }
}

/** Measure a live element rather than eyeballing it. */
const measure = async (selector) =>
  page.locator(selector).first().evaluate((el) => {
    const r = el.getBoundingClientRect()
    return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), pctVh: +((r.height / innerHeight) * 100).toFixed(1) }
  })

// ---------------------------------------------------------------- the journey

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(700)

await step('landing', async () => {
  await shot('01-landing')
  await shot('01b-landing-full', { fullPage: true })
  notes.overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
})

// --- replace everything below with this app's real flows ---------------------
//
// A useful order, because it mirrors how someone actually meets the app:
//   1. landing / first screen, and whatever choice it asks for
//   2. the main task, done properly — type real input, not "test"
//   3. the main task's finished state, and whatever it offers there
//      (share, save, export, print) — follow each output somewhere else
//   4. the secondary screens: saved items, settings, history
//   5. the empty state of each of those, reached the way a user would reach it
//   6. reload mid-task; press Back; open a broken deep link
//   7. theme: toggle to dark, revisit the screens with artwork on them
//
// await step('main-task', async () => {
//   await page.getByRole('button', { name: /…/ }).click()
//   await page.waitForTimeout(500)
//   await shot('02-task')
//   notes.actionBar = await measure('footer, [class*="ActionBar"]')
// })

await step('back-button', async () => {
  await page.goBack()
  await page.waitForTimeout(1000)
  notes.afterBack = { url: page.url(), title: await page.title() }
  await shot('90-after-back')
})

await step('reload-persistence', async () => {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await shot('91-after-reload')
})

notes.errors = errors
fs.writeFileSync(`${OUT}/../notes-${vp}.json`, JSON.stringify(notes, null, 2))
console.log(vp, JSON.stringify(notes, null, 2))
await browser.close()
