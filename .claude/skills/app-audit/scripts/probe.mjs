/**
 * Generic first-pass probe. Knows nothing about the app — point it at a URL and it
 * reports the things that are measurable without clicking anything, plus screenshots
 * of the theme and media variants that usually go unlooked-at.
 *
 * It does not replace driving the app. It tells you where to look first.
 *
 *   node probe.mjs <url> [outDir]
 *
 * Writes <outDir>/probe.json and <outDir>/probe-*.png.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const url = process.argv[2]
const out = process.argv[3] ?? './probe-out'
if (!url) {
  console.error('usage: node probe.mjs <url> [outDir]')
  process.exit(1)
}
fs.mkdirSync(out, { recursive: true })

// Playwright lives in the portfolio repo, not next to this script.
const require = createRequire(import.meta.url)
let playwrightPath = process.env.PLAYWRIGHT_PATH
if (!playwrightPath) {
  let dir = process.cwd()
  while (dir !== path.dirname(dir)) {
    const candidate = path.join(dir, 'node_modules/playwright/index.mjs')
    if (fs.existsSync(candidate)) { playwrightPath = candidate; break }
    dir = path.dirname(dir)
  }
}
if (!playwrightPath) {
  console.error('Could not find playwright. Run from inside the repo, or set PLAYWRIGHT_PATH.')
  process.exit(1)
}
const { chromium, devices } = await import(playwrightPath)

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  tablet: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2 },
  mobile: { ...devices['iPhone 13'] },
}

const luminance = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const c = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const ratio = (a, b) => {
  const x = luminance(a), y = luminance(b)
  if (x === null || y === null) return null
  return +(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2))
}
const rgbToHex = (rgb) => {
  const m = /rgba?\(([^)]+)\)/.exec(rgb)
  if (!m) return null
  const [r, g, b, a] = m[1].split(',').map((n) => parseFloat(n))
  if (a !== undefined && a < 1) return null // composited — measure it in the browser instead
  return '#' + [r, g, b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')
}

const report = { url, ranAt: new Date().toISOString(), viewports: {} }
const browser = await chromium.launch()

for (const [name, opts] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext(opts)
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()} — ${r.failure()?.errorText}`))

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${out}/probe-${name}-light.png` })

  const data = await page.evaluate(() => {
    const seen = new Set()
    const small = []
    for (const el of document.querySelectorAll('a, button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.width >= 44 && r.height >= 44) continue
      const label = (el.getAttribute('aria-label') || el.innerText || el.value || el.tagName).replace(/\s+/g, ' ').trim().slice(0, 44)
      const key = label + Math.round(r.width) + Math.round(r.height)
      if (seen.has(key)) continue
      seen.add(key)
      small.push({ label, w: +r.width.toFixed(1), h: +r.height.toFixed(1), tag: el.tagName.toLowerCase() })
    }

    // Text actually on screen, paired with the ground it is painted on.
    const groundOf = (el) => {
      let n = el
      while (n && n !== document.documentElement) {
        const bg = getComputedStyle(n).backgroundColor
        if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return bg
        n = n.parentElement
      }
      return getComputedStyle(document.body).backgroundColor
    }
    const textSeen = new Set()
    const text = []
    for (const el of document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, li, label, td, th, div')) {
      if (!el.childNodes.length) continue
      const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (!direct) continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0 || r.top > innerHeight * 3) continue
      const cs = getComputedStyle(el)
      const key = cs.color + '|' + groundOf(el) + '|' + cs.fontSize + cs.fontWeight
      if (textSeen.has(key)) continue
      textSeen.add(key)
      text.push({
        sample: el.innerText.replace(/\s+/g, ' ').trim().slice(0, 40),
        color: cs.color, ground: groundOf(el),
        px: parseFloat(cs.fontSize), weight: cs.fontWeight,
      })
    }

    const root = getComputedStyle(document.documentElement)
    const tokens = {}
    for (const sheet of document.styleSheets) {
      let rules
      try { rules = sheet.cssRules } catch { continue }
      for (const rule of rules ?? []) {
        if (!rule.style) continue
        for (const prop of rule.style) {
          if (prop.startsWith('--') && !(prop in tokens)) {
            const v = root.getPropertyValue(prop).trim()
            if (v) tokens[prop] = v
          }
        }
      }
    }

    const fixed = [...document.querySelectorAll('*')]
      .filter((el) => ['fixed', 'sticky'].includes(getComputedStyle(el).position))
      .map((el) => {
        const r = el.getBoundingClientRect()
        return { tag: el.tagName.toLowerCase(), h: Math.round(r.height), pctOfViewport: +((r.height / innerHeight) * 100).toFixed(1) }
      })
      .filter((f) => f.h > 24)

    const smallInputs = [...document.querySelectorAll('input, textarea, select')]
      .map((el) => ({ type: el.type ?? el.tagName.toLowerCase(), px: parseFloat(getComputedStyle(el).fontSize) }))
      .filter((i) => i.px < 16)

    return {
      overflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      title: document.title,
      lang: document.documentElement.lang || null,
      h1Count: document.querySelectorAll('h1').length,
      imagesMissingAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
      iconButtonsWithoutLabel: [...document.querySelectorAll('button')]
        .filter((b) => !b.innerText.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title')).length,
      smallTargets: small, textPairs: text, tokens, fixedBars: fixed, smallInputs,
    }
  })

  data.contrast = data.textPairs.map((t) => {
    const fg = rgbToHex(t.color), bg = rgbToHex(t.ground)
    const r = fg && bg ? ratio(fg, bg) : null
    const large = t.px >= 24 || (t.px >= 18.66 && parseInt(t.weight, 10) >= 700)
    return { ...t, fg, bg, ratio: r, needs: large ? 3 : 4.5, passes: r === null ? null : r >= (large ? 3 : 4.5) }
  })
  data.contrastFailures = data.contrast.filter((c) => c.passes === false)
  delete data.textPairs
  data.errors = errors

  // Dark, print and reduced-motion, which are usually the unlooked-at variants.
  const darkCtx = await browser.newContext({ ...opts, colorScheme: 'dark' })
  const darkPage = await darkCtx.newPage()
  await darkPage.goto(url, { waitUntil: 'networkidle' })
  await darkPage.waitForTimeout(800)
  await darkPage.screenshot({ path: `${out}/probe-${name}-dark.png` })
  data.darkThemeAttr = await darkPage.evaluate(() => document.documentElement.dataset.theme ?? null)
  await darkCtx.close()

  if (name === 'desktop') {
    const printCtx = await browser.newContext({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 })
    const printPage = await printCtx.newPage()
    await printPage.goto(url, { waitUntil: 'networkidle' })
    await printPage.emulateMedia({ media: 'print' })
    await printPage.waitForTimeout(500)
    await printPage.screenshot({ path: `${out}/probe-print-a4.png` })
    await printCtx.close()

    const motionCtx = await browser.newContext({ ...opts, reducedMotion: 'reduce' })
    const motionPage = await motionCtx.newPage()
    await motionPage.goto(url, { waitUntil: 'networkidle' })
    await motionPage.waitForTimeout(800)
    await motionPage.screenshot({ path: `${out}/probe-reduced-motion.png` })
    await motionCtx.close()

    // Keyboard: walk the first dozen stops and record what focus looks like.
    const focus = []
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab')
      focus.push(await page.evaluate(() => {
        const el = document.activeElement
        if (!el || el === document.body) return null
        const cs = getComputedStyle(el)
        return {
          label: (el.getAttribute('aria-label') || el.innerText || el.tagName).replace(/\s+/g, ' ').trim().slice(0, 34),
          outlineWidth: cs.outlineWidth, outlineColor: cs.outlineColor, boxShadow: cs.boxShadow.slice(0, 40),
        }
      }))
    }
    data.focusWalk = focus
    await page.screenshot({ path: `${out}/probe-focus.png` })
  }

  report.viewports[name] = data
  await ctx.close()
}

await browser.close()
fs.writeFileSync(`${out}/probe.json`, JSON.stringify(report, null, 2))

// Console summary — the bit you actually read.
for (const [name, d] of Object.entries(report.viewports)) {
  console.log(`\n== ${name} ==`)
  console.log(`  overflow ${d.overflowPx}px · errors ${d.errors.length} · unlabelled icon buttons ${d.iconButtonsWithoutLabel}`)
  if (d.contrastFailures.length) {
    console.log(`  contrast failures (${d.contrastFailures.length}):`)
    for (const c of d.contrastFailures) console.log(`    ${String(c.ratio).padStart(5)}:1 needs ${c.needs} — ${c.px}px "${c.sample}"`)
  }
  if (d.fixedBars.length) console.log(`  fixed/sticky: ${d.fixedBars.map((f) => `${f.tag} ${f.h}px (${f.pctOfViewport}% of viewport)`).join(', ')}`)
  if (d.smallInputs.length) console.log(`  inputs under 16px (iOS zooms): ${d.smallInputs.map((i) => `${i.type} ${i.px}px`).join(', ')}`)
  if (name === 'mobile' && d.smallTargets.length) {
    console.log(`  targets under 44px (${d.smallTargets.length}):`)
    for (const t of d.smallTargets.slice(0, 18)) console.log(`    ${String(Math.round(t.w)).padStart(4)}×${String(Math.round(t.h)).padEnd(4)} ${t.label}`)
  }
  if (d.errors.length) for (const e of d.errors.slice(0, 8)) console.log(`  ! ${e}`)
}
console.log(`\nwrote ${out}/probe.json and screenshots`)
