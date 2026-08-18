import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/features/projects/projects";
import { getVisibleProjects, type SortValue } from "./home.utils";
import type { ViewMode } from "./ViewTabs";

/** Every app shares one origin now, so storage keys are namespaced. */
const VIEW_KEY = "portfolio.view";

const getInitialView = (): ViewMode => {
  if (typeof window === "undefined") return "feed";
  return window.localStorage.getItem(VIEW_KEY) === "grid" ? "grid" : "feed";
};

export function useProjectSearch(projects: Project[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortValue>("date-desc");
  const [view, setView] = useState<ViewMode>(getInitialView);

  useEffect(() => {
    window.localStorage.setItem(VIEW_KEY, view);
  }, [view]);

  const visibleProjects = useMemo(
    () => getVisibleProjects(projects, searchQuery, sortBy),
    [projects, searchQuery, sortBy]
  );

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    view,
    setView,
    visibleProjects
  };
}
