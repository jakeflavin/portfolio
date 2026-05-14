import { useMemo, useState } from "react";
import type { Project } from "@/features/projects/projects";
import { getVisibleProjects, type SortValue } from "./home.utils";

export function useProjectSearch(projects: Project[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortValue>("date-desc");

  const visibleProjects = useMemo(
    () => getVisibleProjects(projects, searchQuery, sortBy),
    [projects, searchQuery, sortBy]
  );

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    visibleProjects
  };
}
