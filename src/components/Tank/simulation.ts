/**
 * The tank's simulation, with no canvas in it.
 *
 * Everything is in tile units: x and y run 0..1 across the tile whatever its pixel size,
 * and speeds are tile-widths per second. Drawing scales it. Keeping the fish out of the
 * component is what makes them testable: a step is a pure function of state and time.
 */

export type Fish = {
  x: number
  y: number
  /** Velocity in tile units per second. */
  vx: number
  vy: number
  /** Body length as a fraction of the tile width. */
  size: number
  color: string
  /** 0 is the back of the tank, 1 the glass. Back fish draw smaller and dimmer. */
  depth: number
  /** Where the fish wants to be heading, before anything frightens it. */
  heading: number
  /** When it next picks a new heading. */
  turnAt: number
  /** Which way it is drawn facing; kept through a slow turn so it never flickers. */
  face: 1 | -1
  /** Tail beat phase. */
  tail: number
  /** Vertical bob phase. */
  bob: number
}

export type Bubble = { x: number; y: number; r: number; wobble: number; speed: number }

export type Shark = { x: number; dir: 1 | -1; y: number } | null

export type Tank = {
  fish: Fish[]
  bubbles: Bubble[]
  shark: Shark
  /** Seconds until the shark next comes through. */
  sharkIn: number
  /** Elapsed simulation time. */
  t: number
  /** A deterministic random, so a test can replay a tank exactly. */
  rand: () => number
}

/** Cruising speed, tile widths per second. Slow: a tank is something you glance at. */
const CRUISE = 0.045
/** How fast a frightened fish goes, and how quickly the fright wears off. */
const DART = 0.6
const DRAG = 2.2
/** The shark's pace and how far ahead of it the fish notice. */
const SHARK_SPEED = 0.12
const SHARK_FEAR = 0.35
const MAX_BUBBLES = 7

/** Mulberry32: tiny, seedable, good enough for fish. */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createTank(colors: string[], seed = 7): Tank {
  const rand = seeded(seed)
  const fish: Fish[] = colors.map((color, i) => {
    const depth = i % 2 === 0 ? 0.35 + rand() * 0.25 : 0.75 + rand() * 0.25
    const heading = rand() < 0.5 ? Math.PI : 0
    return {
      x: 0.1 + rand() * 0.8,
      y: 0.15 + rand() * 0.6,
      vx: Math.cos(heading) * CRUISE,
      vy: 0,
      size: 0.16 + rand() * 0.1,
      color,
      depth,
      heading,
      turnAt: 2 + rand() * 6,
      face: Math.cos(heading) < 0 ? -1 : 1,
      tail: rand() * Math.PI * 2,
      bob: rand() * Math.PI * 2,
    }
  })
  return { fish, bubbles: [], shark: null, sharkIn: 45 + rand() * 45, t: 0, rand }
}

/** A tap on the glass at (x, y): every fish darts away from it, nearer ones harder. */
export function tap(tank: Tank, x: number, y: number): Tank {
  return {
    ...tank,
    fish: tank.fish.map((f) => {
      const dx = f.x - x
      const dy = f.y - y
      const dist = Math.max(0.08, Math.hypot(dx, dy))
      const push = (DART / dist) * 0.25
      return { ...f, vx: f.vx + (dx / dist) * push, vy: f.vy + (dy / dist) * push }
    }),
  }
}

export function step(tank: Tank, dt: number): Tank {
  const t = tank.t + dt
  const rand = tank.rand

  // The shark: due, it enters from one side at the back; through, it goes and books the next.
  let shark = tank.shark
  let sharkIn = tank.sharkIn
  if (!shark) {
    sharkIn -= dt
    if (sharkIn <= 0) {
      const dir: 1 | -1 = rand() < 0.5 ? 1 : -1
      shark = { x: dir === 1 ? -0.4 : 1.4, dir, y: 0.3 + rand() * 0.3 }
    }
  } else {
    shark = { ...shark, x: shark.x + shark.dir * SHARK_SPEED * dt }
    if (shark.x < -0.5 || shark.x > 1.5) {
      shark = null
      sharkIn = 60 + rand() * 60
    }
  }

  const fish = tank.fish.map((f) => {
    let { heading, turnAt, vx, vy } = f
    // Wandering: every few seconds, a new direction, biased back toward the middle.
    if (t >= turnAt) {
      const back = Math.atan2(0.45 - f.y, 0.5 - f.x)
      heading = rand() < 0.35 ? back + (rand() - 0.5) * 1.2 : (rand() < 0.5 ? 0 : Math.PI) + (rand() - 0.5) * 0.6
      turnAt = t + 2 + rand() * 6
    }
    // Steer off the walls before hitting them.
    if (f.x < 0.08 && Math.cos(heading) < 0) heading = (rand() - 0.5) * 0.6
    if (f.x > 0.92 && Math.cos(heading) > 0) heading = Math.PI + (rand() - 0.5) * 0.6
    if (f.y < 0.08 && Math.sin(heading) < 0) heading = Math.abs(heading)
    if (f.y > 0.82 && Math.sin(heading) > 0) heading = -Math.abs(heading)

    // The cruise it wants; the fright it has decays toward that.
    const wantX = Math.cos(heading) * CRUISE
    const wantY = Math.sin(heading) * CRUISE * 0.5
    vx += (wantX - vx) * Math.min(1, DRAG * dt)
    vy += (wantY - vy) * Math.min(1, DRAG * dt)

    // Fish keep away from a passing shark.
    if (shark && Math.abs(shark.x - f.x) < SHARK_FEAR) {
      const away = f.x < shark.x ? -1 : 1
      vx += away * 0.25 * dt * (1 - Math.abs(shark.x - f.x) / SHARK_FEAR) * 4
    }

    const speed = Math.hypot(vx, vy)
    const face: 1 | -1 = vx > 0.004 ? 1 : vx < -0.004 ? -1 : f.face
    return {
      ...f,
      face,
      heading,
      turnAt,
      vx,
      vy,
      x: Math.min(0.98, Math.max(0.02, f.x + vx * dt)),
      y: Math.min(0.9, Math.max(0.04, f.y + vy * dt)),
      // The tail beats with speed, and the body bobs slowly whatever it does.
      tail: f.tail + dt * (4 + speed * 30),
      bob: f.bob + dt * 1.2,
    }
  })

  // Bubbles rise, wobble and pop; a new one now and then from somewhere on the floor.
  let bubbles = tank.bubbles
    .map((b) => ({ ...b, y: b.y - b.speed * dt, wobble: b.wobble + dt * 3 }))
    .filter((b) => b.y > -0.02)
  if (bubbles.length < MAX_BUBBLES && rand() < dt * 0.9) {
    bubbles = [
      ...bubbles,
      { x: 0.15 + rand() * 0.7, y: 0.96, r: 0.006 + rand() * 0.01, wobble: rand() * 6, speed: 0.08 + rand() * 0.08 },
    ]
  }

  return { ...tank, t, fish, bubbles, shark, sharkIn }
}
