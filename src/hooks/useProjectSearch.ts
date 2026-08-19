import { useCallback, useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import {
  getVisibleProjects,
  parseDirectoryState,
  toQueryString,
  type SortValue,
  type ViewValue
} from "@/lib/home.utils";

/**
 * Search, sort and layout for the directory, kept in the URL.
 *
 * The URL is the source of truth so a filtered directory can be linked to and the back
 * button undoes a search rather than leaving the page. There is no router here — one page
 * never justified one — so this talks to the History API directly.
 */
export function useProjectSearch(projects: Project[]) {
  const [state, setState] = useState(() =>
    parseDirectoryState(typeof window === "undefined" ? "" : window.location.search)
  );

  const { searchQuery, sortBy, view } = state;

  /*
   * replaceState rather than pushState: typing a query would otherwise stack one history
   * entry per keystroke, and backing out of a search would mean pressing back once per
   * character typed.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const next = `${window.location.pathname}${toQueryString(state)}`;
    if (next !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, "", next);
    }
  }, [state]);

  // Back and forward move between whatever states did get pushed, and any link someone
  // pastes in with its own query string.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const onPopState = () => setState(parseDirectoryState(window.location.search));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const setSearchQuery = useCallback(
    (value: string) => setState((previous) => ({ ...previous, searchQuery: value })),
    []
  );
  const setSortBy = useCallback(
    (value: SortValue) => setState((previous) => ({ ...previous, sortBy: value })),
    []
  );
  const setView = useCallback(
    (value: ViewValue) => setState((previous) => ({ ...previous, view: value })),
    []
  );

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
