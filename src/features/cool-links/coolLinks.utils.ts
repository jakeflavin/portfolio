import type { CoolLink } from "./coolLinksDb";
import { CATEGORY_DESCRIPTIONS, CATEGORY_OPTIONS, CATEGORY_ORDER } from "./coolLinkCategories";

export interface FormErrors {
  title?: string;
  url?: string;
  category?: string;
}

export function isValidHttpsUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" && !!url.hostname && url.hostname.length >= 2;
  } catch {
    return false;
  }
}

export function validateForm(title: string, url: string, category: string): FormErrors {
  const errors: FormErrors = {};
  const trimmedTitle = title.trim();
  const trimmedUrl = url.trim();
  const trimmedCategory = category.trim();

  if (!trimmedTitle) {
    errors.title = "Name is required.";
  }

  if (!trimmedUrl) {
    errors.url = "URL is required.";
  } else if (!isValidHttpsUrl(trimmedUrl)) {
    errors.url = "URL must be a valid HTTPS address (e.g. https://www.google.com).";
  }

  if (!trimmedCategory) {
    errors.category = "Please select a category.";
  } else if (!CATEGORY_OPTIONS.some((option) => option.value === trimmedCategory)) {
    errors.category = "Please select a valid category.";
  }

  return errors;
}

export function groupLinksByCategory(links: CoolLink[]): Map<string, CoolLink[]> {
  const map = new Map<string, CoolLink[]>();
  const known = new Set(CATEGORY_ORDER);

  for (const link of links) {
    const key =
      link.category && known.has(link.category as (typeof CATEGORY_ORDER)[number])
        ? link.category
        : "uncategorized";

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(link);
  }

  return map;
}

export function getTruncateLength(listLength: number): number {
  if (listLength >= 18) return 18;
  if (listLength >= 12) return 12;
  if (listLength >= 6) return 6;
  if (listLength >= 3) return 3;
  return listLength;
}

export function getCategoryDescription(category: string): string | null {
  return CATEGORY_DESCRIPTIONS[category] ?? null;
}
