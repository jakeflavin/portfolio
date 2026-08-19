import type { Project } from "@/lib/projects";

export const SORT_OPTIONS = [
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "date-asc", label: "Oldest" },
  { value: "date-desc", label: "Newest" }
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/**
 * How the directory is laid out.
 *
 * Three, and deliberately not more. A previous pass shipped a view switch that made the
 * page harder to use, and the lesson was not "no switching" but that every extra mode is
 * another thing to understand before you can find a tool. Each of these answers a
 * different question: cards for browsing, grid for recognising something by sight, list
 * for scanning names and builds.
 */
export const VIEW_OPTIONS = [
  { value: "cards", label: "Cards" },
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" }
] as const;

export type ViewValue = (typeof VIEW_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortValue = "date-desc";
export const DEFAULT_VIEW: ViewValue = "cards";

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value) as readonly string[];
const VIEW_VALUES = VIEW_OPTIONS.map((option) => option.value) as readonly string[];

export interface DirectoryState {
  searchQuery: string;
  sortBy: SortValue;
  view: ViewValue;
}

/** Reads directory state out of a query string, falling back for anything unrecognised. */
export function parseDirectoryState(search: string): DirectoryState {
  const params = new URLSearchParams(search);
  const sort = params.get("sort");
  const view = params.get("view");

  return {
    searchQuery: params.get("q") ?? "",
    sortBy: (sort && SORT_VALUES.includes(sort) ? sort : DEFAULT_SORT) as SortValue,
    view: (view && VIEW_VALUES.includes(view) ? view : DEFAULT_VIEW) as ViewValue
  };
}

/**
 * Serialises directory state back to a query string.
 *
 * Defaults are omitted so the plain directory keeps a clean URL, and so a shared link
 * carries only what the sender actually changed.
 */
export function toQueryString({ searchQuery, sortBy, view }: DirectoryState): string {
  const params = new URLSearchParams();
  const query = searchQuery.trim();

  if (query) params.set("q", query);
  if (sortBy !== DEFAULT_SORT) params.set("sort", sortBy);
  if (view !== DEFAULT_VIEW) params.set("view", view);

  const serialised = params.toString();
  return serialised ? `?${serialised}` : "";
}

export function sortProjects(projects: Project[], sortBy: SortValue): Project[] {
  const copy = [...projects];

  switch (sortBy) {
    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case "date-asc":
      return copy.sort((a, b) => a.creationDate.getTime() - b.creationDate.getTime());
    case "date-desc":
      return copy.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime());
    default:
      return copy;
  }
}

export function filterProjects(projects: Project[], searchQuery: string): Project[] {
  const query = searchQuery.trim().toLowerCase();

  if (!query) return [...projects];

  return projects.filter(
    (project) =>
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      (project.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false)
  );
}

export function getVisibleProjects(
  projects: Project[],
  searchQuery: string,
  sortBy: SortValue
): Project[] {
  const sorted = sortProjects(filterProjects(projects, searchQuery), sortBy);

  // Projects that aren't live yet still show, as "coming soon", but never above a
  // project someone can actually open.
  return [
    ...sorted.filter((project) => !project.disabled),
    ...sorted.filter((project) => project.disabled)
  ];
}
