import type { SelectOption } from './Select'

export const LISTBOX_MAX_HEIGHT = 256
export const LISTBOX_GAP = 4

/**
 * The narrowest the menu may be, whatever the control that opened it.
 *
 * The menu used to take the trigger's width exactly, which is right when the trigger is a
 * full-width field and wrong when it has collapsed. On a phone the sort control shrinks to
 * its chevron, and the menu came out 32px wide with every option wrapped to one letter a
 * line.
 */
export const LISTBOX_MIN_WIDTH = 176

/** Kept clear of the viewport edges, so a menu near one is not half off the screen. */
export const LISTBOX_MARGIN = 8

/**
 * Where the menu goes: at least readable, and never past either edge of the window.
 *
 * Anchored to the trigger's left while it fits, then pushed back inside. Widening a menu
 * anchored near the right edge is what puts it off screen, so the clamp has to happen
 * after the width is decided rather than before.
 */
export function placeListbox(
  rect: { left: number; width: number },
  viewportWidth: number,
): { left: number; width: number } {
  const width = Math.min(
    Math.max(rect.width, LISTBOX_MIN_WIDTH),
    viewportWidth - LISTBOX_MARGIN * 2,
  )
  const furthestLeft = viewportWidth - width - LISTBOX_MARGIN
  return { width, left: Math.max(LISTBOX_MARGIN, Math.min(rect.left, furthestLeft)) }
}

export function getDisplayLabel(
  options: SelectOption[],
  value: string,
  placeholder?: string,
): string {
  return options.find((option) => option.value === value)?.label ?? placeholder ?? ''
}

export function getSelectedOptionIndex(options: SelectOption[], value: string): number {
  return value
    ? Math.max(
        0,
        options.findIndex((option) => option.value === value),
      )
    : 0
}

export function getNextIndex(index: number, optionCount: number): number {
  return index < optionCount - 1 ? index + 1 : index
}

export function getPreviousIndex(index: number): number {
  return index > 0 ? index - 1 : 0
}
