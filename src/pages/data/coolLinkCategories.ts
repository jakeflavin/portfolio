/**
 * Cool link categories: single source of truth for the add form and section lists.
 * Edit this file to change labels, descriptions, or add/remove categories.
 */

export interface CoolLinkCategoryConfig {
  value: string;
  label: string;
  description: string;
}

export const COOL_LINK_CATEGORIES: CoolLinkCategoryConfig[] = [
  { value: "developerTools", label: "Developer Tools", description: "High-quality tools for building, testing, and shipping software faster." },
  { value: "learningPlatforms", label: "Learning Platforms", description: "Structured resources for mastering technical and professional skills." },
  { value: "designAndUiInspiration", label: "Design & UI Inspiration", description: "Inspiration, components, and assets for building clean interfaces." },
  { value: "productivity", label: "Productivity", description: "Tools that help you organize work, time, and focus." },
  { value: "dataAndApis", label: "Data & APIs", description: "Open datasets and APIs for building apps and experiments." },
  { value: "aiTools", label: "AI Tools", description: "Modern AI platforms for building, testing, or using AI capabilities." },
  { value: "careerAndFreelancing", label: "Career & Freelancing", description: "Resources for finding work, improving your profile, and freelancing." },
  { value: "writingAndPublishing", label: "Writing & Publishing", description: "Platforms for writing, publishing, and sharing ideas." },
  { value: "healthAndPerformance", label: "Health & Performance", description: "Evidence-based tools for optimizing physical and mental performance." },
  { value: "financeAndInvesting", label: "Finance & Investing", description: "Tools for tracking money, learning finance, and investing." },
  { value: "funAndInteractive", label: "Fun & Interactive", description: "Interesting, clever, or entertaining web experiences." },
  { value: "referenceAndKnowledge", label: "Reference & Knowledge", description: "Reliable sources for research, documentation, and facts." },
  { value: "emergingSocialMedia", label: "Emerging Social Media", description: "Links to emerging social media platforms and communities." },
  { value: "other", label: "Other", description: "Other useful links" }
];

/** For links with no category or an unknown category value. */
export const UNCATEGORIZED = {
  value: "uncategorized",
  label: "Uncategorized",
  description: "Links without a category"
} as const;

/** Ordered category keys for section display (main categories first, then uncategorized). */
export const CATEGORY_ORDER = [
  ...COOL_LINK_CATEGORIES.map((c) => c.value),
  UNCATEGORIZED.value
] as const;

/** Select options for the add-link form (value + label only). */
export const CATEGORY_OPTIONS = COOL_LINK_CATEGORIES.map(({ value, label }) => ({
  value,
  label
}));

/** Lookup: category value -> display label. */
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries([
  ...COOL_LINK_CATEGORIES.map((c) => [c.value, c.label]),
  [UNCATEGORIZED.value, UNCATEGORIZED.label]
]);

/** Lookup: category value -> description. */
export const CATEGORY_DESCRIPTIONS: Record<string, string> = Object.fromEntries([
  ...COOL_LINK_CATEGORIES.map((c) => [c.value, c.description]),
  [UNCATEGORIZED.value, UNCATEGORIZED.description]
]);
