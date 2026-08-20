import { describe, expect, it } from 'vitest'
import { AVATARS, pickAvatar } from './avatars'

describe('pickAvatar', () => {
  it('can reach every photo', () => {
    const reached = new Set(AVATARS.map((_, i) => pickAvatar(() => i / AVATARS.length)?.src))
    expect(reached.size).toBe(AVATARS.length)
  })

  it('stays inside the list when random returns its upper bound', () => {
    // Math.random never returns 1, but a pinned stub might, and an out-of-range index here
    // would render a broken image rather than fail loudly.
    expect(pickAvatar(() => 0.999999)).toBe(AVATARS[AVATARS.length - 1])
  })

  it('gives every photo alt text', () => {
    for (const avatar of AVATARS) expect(avatar.alt.length).toBeGreaterThan(0)
  })
})
