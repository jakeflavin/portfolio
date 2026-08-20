import { describe, it, expect } from 'vitest'
import { LISTBOX_MARGIN, LISTBOX_MIN_WIDTH, placeListbox } from './select.utils'

describe('placeListbox', () => {
  /** The bug this exists for: a control collapsed to its chevron opened a 32px menu. */
  it('widens past a collapsed trigger', () => {
    const { width } = placeListbox({ left: 340, width: 32 }, 390)
    expect(width).toBeGreaterThanOrEqual(Math.min(LISTBOX_MIN_WIDTH, 390 - LISTBOX_MARGIN * 2))
  })

  it('keeps a menu anchored near the right edge on screen', () => {
    const { left, width } = placeListbox({ left: 340, width: 32 }, 390)
    expect(left).toBeGreaterThanOrEqual(LISTBOX_MARGIN)
    expect(left + width).toBeLessThanOrEqual(390 - LISTBOX_MARGIN)
  })

  it('leaves a trigger that is already wide enough where it is', () => {
    expect(placeListbox({ left: 100, width: 240 }, 1280)).toEqual({ left: 100, width: 240 })
  })

  it('never exceeds the viewport on a narrow screen', () => {
    const { width } = placeListbox({ left: 0, width: 400 }, 320)
    expect(width).toBe(320 - LISTBOX_MARGIN * 2)
  })
})
