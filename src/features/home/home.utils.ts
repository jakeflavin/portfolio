import type { Project } from "@/features/projects/projects";

export const SORT_OPTIONS = [
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "date-asc", label: "Oldest" },
  { value: "date-desc", label: "Newest" }
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

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
  const enabledProjects = projects.filter((project) => project.disabled === false);

  if (!query) return enabledProjects;

  return enabledProjects.filter(
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
  return sortProjects(filterProjects(projects, searchQuery), sortBy);
}
