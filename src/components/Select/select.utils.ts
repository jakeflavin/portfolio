import type { SelectOption } from "./Select";

export const LISTBOX_MAX_HEIGHT = 256;
export const LISTBOX_GAP = 4;

export function getDisplayLabel(
  options: SelectOption[],
  value: string,
  placeholder?: string
): string {
  return options.find((option) => option.value === value)?.label ?? placeholder ?? "";
}

export function getSelectedOptionIndex(options: SelectOption[], value: string): number {
  return value ? Math.max(0, options.findIndex((option) => option.value === value)) : 0;
}

export function getNextIndex(index: number, optionCount: number): number {
  return index < optionCount - 1 ? index + 1 : index;
}

export function getPreviousIndex(index: number): number {
  return index > 0 ? index - 1 : 0;
}
