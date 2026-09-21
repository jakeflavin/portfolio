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
 * Drawn on a canvas because five fish, bubbles, weed and a shark are more shapes than
 * the DOM wants to move sixty times a second. The simulation is in tank.ts and knows
 * nothing about pixels; this file only paints it.
 *
 * Under prefers-reduced-motion it settles the tank once and paints one frame, so the
 * fish are there but still. A hidden tab stops the clock.
 */

type Palette = {
  waterTop: string
  waterBottom: string
  sand: string
  sandLight: string
  weed: string
  shark: string
  ray: string
}

const DARK: Palette = {
  waterTop: '#0f3d6b',
  waterBottom: '#061a30',
  sand: '#2a2418',
  sandLight: '#3a3222',
  weed: '#1f5d3a',
  shark: 'rgba(6, 16, 32, 0.9)',
  ray: 'rgba(255, 255, 255, 0.05)',
}

const LIGHT: Palette = {
  waterTop: '#a9d6ff',
  waterBottom: '#4f93d8',
  sand: '#d9c28f',
  sandLight: '#e8d4a6',
  weed: '#3a8a5a',
  shark: 'rgba(30, 50, 80, 0.75)',
  ray: 'rgba(255, 255, 255, 0.14)',
}

const SAND_LINE = 0.9

/** The theme carries no mode flag, so the page's own surface says whether it is night. */
function isDark(surface: string) {
  const hex = surface.replace('#', '')
  if (hex.length < 6) return false
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5
}

function fishPath(ctx: CanvasRenderingContext2D, len: number, tail: number) {
  // Body, then the tail beating behind it, then the dorsal fin on top.
  const flap = Math.sin(tail) * len * 0.12
  ctx.beginPath()
  ctx.ellipse(0, 0, len / 2, len / 4, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(-len * 0.42, 0)
  ctx.lineTo(-len * 0.78, -len * 0.26 + flap)
  ctx.lineTo(-len * 0.78, len * 0.26 + flap)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(-len * 0.1, -len * 0.22)
  ctx.lineTo(len * 0.12, -len * 0.4)
  ctx.lineTo(len * 0.22, -len * 0.2)
  ctx.closePath()
  ctx.fill()
}

export function paint(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tank: TankState,
  palette: Palette,
) {
  // Water.
  const water = ctx.createLinearGradient(0, 0, 0, h)
  water.addColorStop(0, palette.waterTop)
  water.addColorStop(1, palette.waterBottom)
  ctx.fillStyle = water
  ctx.fillRect(0, 0, w, h)

  // Light through the surface: two slanted bands that drift with the clock.
  ctx.fillStyle = palette.ray
  for (let i = 0; i < 2; i += 1) {
    const x = ((tank.t * 0.01 + i * 0.5) % 1.2) * w - w * 0.2
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + w * 0.18, 0)
    ctx.lineTo(x + w * 0.5, h)
    ctx.lineTo(x + w * 0.3, h)
    ctx.closePath()
    ctx.fill()
  }

  // The shark passes at the back, before the fish are drawn over it.
  if (tank.shark) {
    const len = w * 0.55
    ctx.save()
    ctx.translate(tank.shark.x * w, tank.shark.y * h)
    ctx.scale(tank.shark.dir, 1)
    ctx.fillStyle = palette.shark
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

  // Weed, swaying from the sand.
  ctx.strokeStyle = palette.weed
  ctx.lineCap = 'round'
  const weeds = [
    [0.12, 0.34, 0],
    [0.19, 0.26, 1.7],
    [0.82, 0.3, 0.8],
    [0.88, 0.2, 2.9],
  ] as const
  for (const [x, height, phase] of weeds) {
    const sway = Math.sin(tank.t * 0.8 + phase) * w * 0.05
    ctx.lineWidth = w * 0.028
    ctx.beginPath()
    ctx.moveTo(x * w, SAND_LINE * h)
    ctx.quadraticCurveTo(x * w + sway * 0.4, h * (SAND_LINE - height * 0.6), x * w + sway, h * (SAND_LINE - height))
    ctx.stroke()
  }

  // Sand.
  ctx.fillStyle = palette.sand
  ctx.fillRect(0, SAND_LINE * h, w, h)
  ctx.fillStyle = palette.sandLight
  ctx.beginPath()
  ctx.ellipse(w * 0.55, SAND_LINE * h + h * 0.03, w * 0.35, h * 0.025, 0, 0, Math.PI * 2)
  ctx.fill()

  // Fish, back to front.
  const fish = [...tank.fish].sort((a, b) => a.depth - b.depth)
  for (const f of fish) {
    const len = f.size * w * (0.6 + 0.4 * f.depth)
    ctx.save()
    ctx.globalAlpha = 0.6 + 0.4 * f.depth
    ctx.translate(f.x * w, f.y * h + Math.sin(f.bob) * h * 0.012)
    ctx.scale(f.face, 1)
    ctx.fillStyle = f.color
    fishPath(ctx, len, f.tail)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(len * 0.28, -len * 0.06, len * 0.07, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#17181b'
    ctx.beginPath()
    ctx.arc(len * 0.3, -len * 0.06, len * 0.035, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Bubbles.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)'
  ctx.lineWidth = 1
  for (const b of tank.bubbles) {
    ctx.beginPath()
    ctx.arc(b.x * w + Math.sin(b.wobble) * w * 0.015, b.y * h, Math.max(1.5, b.r * w), 0, Math.PI * 2)
    ctx.stroke()
  }

  // The glass: one soft highlight in the top corner.
  const glass = ctx.createLinearGradient(0, 0, w * 0.5, h * 0.5)
  glass.addColorStop(0, 'rgba(255, 255, 255, 0.16)')
  glass.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = glass
  ctx.fillRect(0, 0, w, h)
}

export function Tank() {
  const theme = useTheme()
  const stops = theme.gradient.stops
  const dark = isDark(theme.colors.surface)
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const palette = dark ? DARK : LIGHT
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
  }, [stops, dark])

  return (
    <Glass>
      <canvas ref={ref} aria-hidden="true" data-testid="tank" />
    </Glass>
  )
}
