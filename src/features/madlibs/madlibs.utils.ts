import Handlebars from "handlebars";
import { MADLIB_STORY_TYPES, getMadlibFormKeys } from "./madlibStories";

export const FORM_KEYS = getMadlibFormKeys();
export const STORY_PLACEHOLDER =
  "Fill out the form and click Generate to see your Mad Lib story here.";

export function createInitialMadlibValues(): Record<string, string> {
  return FORM_KEYS.reduce((acc, key) => ({ ...acc, [key]: "" }), {});
}

export function areMadlibValuesFilled(values: Record<string, string>): boolean {
  return FORM_KEYS.every((key) => (values[key] ?? "").trim() !== "");
}

export function getMadlibStoryOptions() {
  return MADLIB_STORY_TYPES.map((type) => ({ value: type.value, label: type.label }));
}

export function generateMadlibStory(
  storyType: string,
  values: Record<string, string>
): string | null {
  const type = MADLIB_STORY_TYPES.find((item) => item.value === storyType);
  if (!type) return null;

  return Handlebars.compile(type.template)(values);
}
