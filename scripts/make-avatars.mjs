#!/usr/bin/env node
/**
 * Crops the profile photos to squares and writes them where the site expects them.
 *
 *   node scripts/make-avatars.mjs
 *
 * Sources live in `assets/avatars/` and are not what ships - the cropped output in
 * `public/images/avatars/` is. Both are committed, so the crop can be redone without
 * hunting for the original.
 *
 * Two tools, each for the one thing it is good at. `sips` is macOS's own and reads HEIC,
 * so it decodes the source to PNG; its cropping does not take the offsets it appears to,
 * so the crop itself is a canvas draw in the browser Playwright already installs for the
 * visual guard, where the numbers mean exactly what they say.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync, readdirSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'assets/avatars')
const outDir = join(root, 'public/images/avatars')
const workDir = join(root, 'node_modules/.cache/avatars')

/** The finished square, in pixels. Twice the 96px the ring is, for a 2x screen. */
const SIZE = 400
const QUALITY = 0.82

/**
 * Where in each photo the square goes, as fractions of the source.
 *
 * `centre` is the point the crop is built around and `span` is how much of the shorter
 * side it takes, so the numbers stay meaningful if a photo is re-exported at another
 * resolution. The crop is clamped to the frame, so a centre near an edge slides in rather
 * than leaving a band of nothing.
 */
const CROPS = {
  // Two faces to fit, so the square takes the full width of the frame.
  'jake-kids-of-steel': { source: 'IMG_3532', centre: [0.5, 0.36], span: 1.0 },
  // Wide enough to keep both fists in, since the pose is the point.
  'jake-marathon': { source: 'IMG_0904', centre: [0.494, 0.44], span: 0.62 },
  // Tighter, but high enough in the frame to keep the castle behind him.
  'jake-castle': { source: 'IMG_0175', centre: [0.458, 0.478], span: 0.5 },
}

function findSource(stem) {
  const match = readdirSync(sourceDir).find((name) => name.replace(/\.[^.]+$/, '') === stem)
  if (!match) throw new Error(`No source named ${stem} in ${sourceDir}`)
  return join(sourceDir, match)
}

if (!existsSync(sourceDir)) {
  console.error(`No ${sourceDir}. Put the originals there first.`)
  process.exit(1)
}
mkdirSync(outDir, { recursive: true })
mkdirSync(workDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage()

for (const [name, { source, centre, span }] of Object.entries(CROPS)) {
  const decoded = join(workDir, `${source}.png`)
  execFileSync('sips', ['-s', 'format', 'png', findSource(source), '--out', decoded], {
    stdio: 'ignore',
  })

  const dataUrl = `data:image/png;base64,${readFileBase64(decoded)}`
  const result = await page.evaluate(
    async ({ dataUrl, centre, span, size, quality }) => {
      const image = new Image()
      image.src = dataUrl
      await image.decode()

      // Square in real pixels, so the span is taken against the shorter side.
      const side = Math.round(Math.min(image.width, image.height) * span)
      const clamp = (value, max) => Math.max(0, Math.min(Math.round(value), max - side))
      const left = clamp(centre[0] * image.width - side / 2, image.width)
      const top = clamp(centre[1] * image.height - side / 2, image.height)

      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext('2d')
      context.imageSmoothingQuality = 'high'
      context.drawImage(image, left, top, side, side, 0, 0, size, size)

      return {
        jpeg: canvas.toDataURL('image/jpeg', quality).split(',')[1],
        note: `${image.width}x${image.height} -> ${side}px square at ${left},${top}`,
      }
    },
    { dataUrl, centre, span, size: SIZE, quality: QUALITY },
  )

  writeFileSync(join(outDir, `${name}.jpg`), Buffer.from(result.jpeg, 'base64'))
  console.log(`${name}: ${result.note} -> ${SIZE}px`)
}

await browser.close()
rmSync(workDir, { recursive: true, force: true })

function readFileBase64(file) {
  return execFileSync('base64', ['-i', file], { encoding: 'utf8', maxBuffer: 1 << 28 }).trim()
}
