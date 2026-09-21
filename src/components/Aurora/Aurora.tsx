import React, { useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import { Tile } from './Aurora.styled'

/**
 * The brand gradient as a living thing.
 *
 * Sits to the left of the profile on a wide screen and does nothing useful on purpose:
 * every other candidate for that space was a tool, and the page already has a directory
 * of those. This is five soft orbs in the wordmark's own stops, drifting on slow sine
 * paths that never repeat exactly, on a tile the same shape as the profile panel beside
 * it. It leans a little toward the pointer, which is the whole interaction.
 *
 * Drawn on a canvas rather than animated CSS gradients: five overlapping radial gradients
 * repainting at 60fps through the compositor is cheap on a canvas and expensive as
 * background-image, and a canvas can be blurred once as a whole.
 *
 * Under prefers-reduced-motion it paints one frame and stops, so the tile is still there
 * and still in colour, just still.
 */

/** One orb: where it lives and how it moves. Positions are fractions of the tile. */
type Orb = {
  /** Its stop in the brand sweep. */
  color: string
  /** Centre of its wander. */
  cx: number
  cy: number
  /** How far it wanders, as a fraction of the tile. */
  ax: number
  ay: number
  /** Angular speed in radians per second; distinct per axis so the path never closes. */
  wx: number
  wy: number
  /** Starting phase, so they do not all cross the centre together. */
  px: number
  py: number
  /** Radius as a fraction of the tile's longer edge. */
  r: number
}

/**
 * Hand-placed rather than random, so the tile looks the same on every visit and the two
 * warm stops sit low where the profile's ember-coloured avatar ring is not.
 */
const ORBS: Omit<Orb, 'color'>[] = [
  { cx: 0.3, cy: 0.25, ax: 0.22, ay: 0.18, wx: 0.11, wy: 0.09, px: 0.0, py: 1.1, r: 0.62 },
  { cx: 0.7, cy: 0.35, ax: 0.2, ay: 0.22, wx: 0.08, wy: 0.13, px: 2.1, py: 0.4, r: 0.55 },
  { cx: 0.5, cy: 0.55, ax: 0.25, ay: 0.2, wx: 0.1, wy: 0.07, px: 4.0, py: 2.6, r: 0.5 },
  { cx: 0.35, cy: 0.78, ax: 0.2, ay: 0.16, wx: 0.07, wy: 0.12, px: 1.4, py: 3.3, r: 0.58 },
  { cx: 0.72, cy: 0.82, ax: 0.18, ay: 0.14, wx: 0.12, wy: 0.08, px: 5.2, py: 0.9, r: 0.52 },
]

/** How far the orbs lean toward the pointer, as a fraction of the tile. */
const LEAN = 0.12

/** Fades the lean in and out so the orbs settle rather than snap when the pointer leaves. */
const EASE = 0.04

export function paint(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stops: string[],
  t: number,
  lean: { x: number; y: number },
) {
  const orbs = ORBS.map((orb, i) => ({ ...orb, color: stops[i] ?? stops[stops.length - 1] ?? '#000' }))
  const long = Math.max(width, height)

  // The first stop is the ground, so the tile is never bare while an orb is elsewhere.
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = orbs[0]?.color ?? '#000'
  ctx.fillRect(0, 0, width, height)

  for (const orb of orbs) {
    const x = (orb.cx + orb.ax * Math.sin(t * orb.wx + orb.px) + lean.x * LEAN) * width
    const y = (orb.cy + orb.ay * Math.sin(t * orb.wy + orb.py) + lean.y * LEAN) * height
    const r = orb.r * long
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, orb.color)
    g.addColorStop(1, `${orb.color}00`)
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
}

export function Aurora() {
  const theme = useTheme()
  const stops = theme.gradient.stops
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    // Where the pointer is, and where the orbs currently are on their way to it.
    const target = { x: 0, y: 0 }
    const lean = { x: 0, y: 0 }
    let frame = 0
    let size = { width: 0, height: 0 }
    const started = performance.now()

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      size = { width: Math.round(rect.width), height: Math.round(rect.height) }
      canvas.width = Math.round(size.width * dpr)
      canvas.height = Math.round(size.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now: number) => {
      lean.x += (target.x - lean.x) * EASE
      lean.y += (target.y - lean.y) * EASE
      paint(ctx, size.width, size.height, stops, (now - started) / 1000, lean)
    }

    const tick = (now: number) => {
      draw(now)
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (still || frame) return
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    // A hidden tab keeps no clock running: the orbs are not seen, so they do not move.
    const onVisibility = () => (document.hidden ? stop() : start())

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const onLeave = () => {
      target.x = 0
      target.y = 0
    }

    measure()
    draw(performance.now())
    start()

    // Sizing the canvas clears it, so every resize paints straight away rather than
    // leaving a bare tile until the next frame. Below the wide layout the tile is
    // display:none and measures 0, and this is also what fills it the moment it appears.
    const resize = new ResizeObserver(() => {
      measure()
      draw(performance.now())
    })
    resize.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      stop()
      resize.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [stops])

  return (
    <Tile>
      <canvas ref={ref} aria-hidden="true" data-testid="aurora" />
    </Tile>
  )
}
