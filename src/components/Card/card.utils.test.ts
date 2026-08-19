import { describe, it, expect } from 'vitest'
import { formatPostAge } from './card.utils'

describe('formatPostAge', () => {
  const now = new Date('2026-08-18T12:00:00Z')

  it('uses compact relative ages while a post is recent, cased to match the dates', () => {
    expect(formatPostAge(new Date('2026-08-18'), now)).toBe('Today')
    expect(formatPostAge(new Date('2026-08-17'), now)).toBe('1d')
    expect(formatPostAge(new Date('2026-08-14'), now)).toBe('4d')
    expect(formatPostAge(new Date('2026-08-04'), now)).toBe('2w')
  })

  it('falls back to a date once relative ages stop meaning anything', () => {
    // Asserted by content rather than by an exact string: the date is formatted in the
    // reader's locale, so "Feb 17" is only what an en reader sees.
    const formatted = formatPostAge(new Date('2026-02-17'), now)
    expect(formatted).toMatch(/17/)
    expect(formatted).not.toMatch(/^\d+[dw]$/)
  })

  it('includes the year only when it differs from the current one', () => {
    expect(formatPostAge(new Date('2026-02-17'), now)).not.toMatch(/2026/)
    expect(formatPostAge(new Date('2025-02-17'), now)).toMatch(/2025/)
  })

  it('does not roll a plain YYYY-MM-DD back a day in a behind-UTC zone', () => {
    // Parsed as UTC midnight; formatting in local time would show Feb 16.
    expect(formatPostAge(new Date('2026-02-17'), now)).toContain('17')
  })

  it('handles a future date without producing a negative age', () => {
    expect(formatPostAge(new Date('2026-09-01'), now)).toBe('Just now')
  })
})
