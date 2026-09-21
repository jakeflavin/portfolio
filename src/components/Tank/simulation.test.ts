import { describe, expect, it } from 'vitest'
import { createTank, step, tap } from './simulation'

const COLORS = ['#2244D8', '#4A42A9', '#72407A', '#9B3E4B', '#C33C1C']

function run(tank: ReturnType<typeof createTank>, seconds: number) {
  let t = tank
  for (let i = 0; i < seconds * 20; i += 1) t = step(t, 0.05)
  return t
}

describe('tank', () => {
  it('has one fish per colour, and the same tank for the same seed', () => {
    const a = createTank(COLORS, 3)
    const b = createTank(COLORS, 3)
    expect(a.fish.map((f) => f.color)).toEqual(COLORS)
    expect(a.fish.map((f) => [f.x, f.y])).toEqual(b.fish.map((f) => [f.x, f.y]))
  })

  it('keeps every fish inside the water for ten minutes', () => {
    const tank = run(createTank(COLORS), 600)
    for (const f of tank.fish) {
      expect(f.x).toBeGreaterThanOrEqual(0.02)
      expect(f.x).toBeLessThanOrEqual(0.98)
      expect(f.y).toBeGreaterThanOrEqual(0.04)
      expect(f.y).toBeLessThanOrEqual(0.9)
    }
  })

  it('moves the fish, and a fish faces the way it swims', () => {
    const before = createTank(COLORS)
    const after = run(before, 5)
    const moved = after.fish.filter((f, i) => Math.hypot(f.x - before.fish[i]!.x, f.y - before.fish[i]!.y) > 0.01)
    expect(moved.length).toBeGreaterThan(0)
    for (const f of after.fish) {
      if (Math.abs(f.vx) > 0.004) expect(Math.sign(f.vx)).toBe(f.face)
    }
  })

  it('scatters the fish away from a tap on the glass', () => {
    const tank = run(createTank(COLORS), 5)
    const x = 0.5
    const y = 0.5
    const before = tank.fish.map((f) => Math.hypot(f.x - x, f.y - y))
    const after = run(tap(tank, x, y), 0.5).fish.map((f) => Math.hypot(f.x - x, f.y - y))
    const fled = after.filter((d, i) => d > before[i]!).length
    expect(fled).toBeGreaterThanOrEqual(COLORS.length - 1)
  })

  it('sends a shark through and then books the next one', () => {
    let tank = createTank(COLORS)
    const due = tank.sharkIn
    tank = run(tank, due + 1)
    expect(tank.shark).not.toBeNull()
    tank = run(tank, 30)
    expect(tank.shark).toBeNull()
    expect(tank.sharkIn).toBeGreaterThan(0)
  })

  it('blows bubbles and lets them pop at the surface', () => {
    const tank = run(createTank(COLORS), 30)
    expect(tank.bubbles.length).toBeGreaterThan(0)
    expect(tank.bubbles.length).toBeLessThanOrEqual(7)
    for (const b of tank.bubbles) expect(b.y).toBeGreaterThan(-0.02)
  })
})
