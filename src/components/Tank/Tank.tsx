import React, { useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import { Glass } from './Tank.styled'
import { createTank, step, tap, type Tank as TankState } from './simulation'

/**
 * A fish tank beside the profile.
 *
 * Sits to the left of the header on a wide screen and is of no use at all, on purpose:
 * everything else proposed for that space was a tool, and the page already has a
 * directory of those. Five fish in the wordmark's five colours wander two layers of
 * water, bubbles rise off the sand, and every minute or two a shark passes along the
 * back and the fish keep clear of it. Tap the glass and they dart.
 *
 * Drawn in the page's own language: the tile is the search bar's fill, and everything in
 * it is a line in the muted ink, the way the page keeps to flat surfaces and hairlines. A
 * painted blue tank was tried first and stood out from everything around it. The five
 * fish still carry the wordmark's five stops in the simulation, which is what tells them
 * apart in tests, but on the page they are all the same ink.
 *
 * On a canvas because five fish, bubbles, weed and a shark are more shapes than the DOM
 * wants to move sixty times a second. The simulation is in simulation.ts and knows nothing
 * about pixels; this file only paints it.
 *
 * Under prefers-reduced-motion it settles the tank once and paints one frame, so the
 * fish are there but still. A hidden tab stops the clock.
 */

type Palette = {
  /** The tile's fill: the same as the search bar's, so it reads as one more flat surface. */
  water: string
  /** Every line in the drawing. */
  ink: string
  /** The shark, and the sand: quieter than the fish. */
  faint: string
}

const SAND_LINE = 0.9
const LINE = 1.5

function fishPath(ctx: CanvasRenderingContext2D, len: number, tail: number) {
  // Body, then the tail beating behind it, then the dorsal fin on top. Each is filled
  // with the water first so a fish crossing another covers it rather than showing through.
  const flap = Math.sin(tail) * len * 0.12
  ctx.beginPath()
  ctx.ellipse(0, 0, len / 2, len / 4, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-len * 0.44, 0)
  ctx.lineTo(-len * 0.78, -len * 0.26 + flap)
  ctx.lineTo(-len * 0.78, len * 0.26 + flap)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-len * 0.08, -len * 0.24)
  ctx.lineTo(len * 0.1, -len * 0.42)
  ctx.lineTo(len * 0.22, -len * 0.22)
  ctx.stroke()
}

export function paint(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tank: TankState,
  palette: Palette,
) {
  ctx.fillStyle = palette.water
  ctx.fillRect(0, 0, w, h)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  // The shark passes at the back, a silhouette in the faint ink, before the fish go over it.
  if (tank.shark) {
    const len = w * 0.55
    ctx.save()
    ctx.translate(tank.shark.x * w, tank.shark.y * h)
    ctx.scale(tank.shark.dir, 1)
    ctx.fillStyle = palette.faint
    ctx.beginPath()
    ctx.ellipse(0, 0, len / 2, len / 7, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(-len * 0.45, 0)
    ctx.lineTo(-len * 0.7, -len * 0.22)
    ctx.lineTo(-len * 0.62, len * 0.1)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(-len * 0.1, -len * 0.1)
    ctx.lineTo(len * 0.02, -len * 0.34)
    ctx.lineTo(len * 0.16, -len * 0.1)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // Weed: thin strokes swaying from the sand line.
  ctx.strokeStyle = palette.ink
  ctx.lineWidth = LINE
  const weeds = [
    [0.12, 0.34, 0],
    [0.19, 0.26, 1.7],
    [0.82, 0.3, 0.8],
    [0.88, 0.2, 2.9],
  ] as const
  for (const [x, height, phase] of weeds) {
    const sway = Math.sin(tank.t * 0.8 + phase) * w * 0.05
    ctx.beginPath()
    ctx.moveTo(x * w, SAND_LINE * h)
    ctx.quadraticCurveTo(x * w + sway * 0.4, h * (SAND_LINE - height * 0.6), x * w + sway, h * (SAND_LINE - height))
    ctx.stroke()
  }

  // Sand: one hairline and a few grains.
  ctx.strokeStyle = palette.faint
  ctx.beginPath()
  ctx.moveTo(0, SAND_LINE * h)
  ctx.lineTo(w, SAND_LINE * h)
  ctx.stroke()
  ctx.fillStyle = palette.faint
  for (const gx of [0.08, 0.3, 0.47, 0.61, 0.74, 0.95]) {
    ctx.beginPath()
    ctx.arc(gx * w, SAND_LINE * h + h * 0.04, LINE, 0, Math.PI * 2)
    ctx.fill()
  }

  // Fish, back to front: outlines in the ink, filled with the water.
  const fish = [...tank.fish].sort((a, b) => a.depth - b.depth)
  for (const f of fish) {
    const len = f.size * w * (0.6 + 0.4 * f.depth)
    ctx.save()
    ctx.globalAlpha = 0.45 + 0.55 * f.depth
    ctx.translate(f.x * w, f.y * h + Math.sin(f.bob) * h * 0.012)
    ctx.scale(f.face, 1)
    ctx.fillStyle = palette.water
    ctx.strokeStyle = palette.ink
    ctx.lineWidth = LINE
    fishPath(ctx, len, f.tail)
    ctx.fillStyle = palette.ink
    ctx.beginPath()
    ctx.arc(len * 0.28, -len * 0.06, Math.max(1.2, len * 0.045), 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Bubbles: hairline circles.
  ctx.strokeStyle = palette.faint
  ctx.lineWidth = 1
  for (const b of tank.bubbles) {
    ctx.beginPath()
    ctx.arc(b.x * w + Math.sin(b.wobble) * w * 0.015, b.y * h, Math.max(1.5, b.r * w), 0, Math.PI * 2)
    ctx.stroke()
  }
}

export function Tank() {
  const theme = useTheme()
  const stops = theme.gradient.stops
  const water = theme.colors.secondary
  const ink = theme.colors.muted
  const faint = theme.colors.border
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const palette: Palette = { water, ink, faint }
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    let tank = createTank(stops)
    // A tank that has been running a while looks lived in; a fresh one has its fish in a row.
    for (let i = 0; i < 200; i += 1) tank = step(tank, 0.05)

    let frame = 0
    let last = 0
    let size = { width: 0, height: 0 }

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      size = { width: Math.round(rect.width), height: Math.round(rect.height) }
      canvas.width = Math.round(size.width * dpr)
      canvas.height = Math.round(size.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => paint(ctx, size.width, size.height, tank, palette)

    const tick = (now: number) => {
      // Clamped, so a tab that was asleep does not wake to fish that teleported.
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      tank = step(tank, dt)
      draw()
      frame = requestAnimationFrame(tick)
    }
    const start = () => {
      if (still || frame) return
      last = 0
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    const onTap = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      tank = tap(tank, (event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height)
      if (still) draw()
    }

    measure()
    draw()
    start()

    // Sizing the canvas clears it, so every resize paints straight away. Below the wide
    // layout the tank is display:none and measures 0; this is what fills it when it appears.
    const resize = new ResizeObserver(() => {
      measure()
      draw()
    })
    resize.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    canvas.addEventListener('pointerdown', onTap)

    return () => {
      stop()
      resize.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('pointerdown', onTap)
    }
  }, [stops, water, ink, faint])

  return (
    <Glass>
      <canvas ref={ref} aria-hidden="true" data-testid="tank" />
    </Glass>
  )
}
