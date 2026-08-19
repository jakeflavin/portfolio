import { describe, it, expect } from "vitest";
import { filterProjects, sortProjects, getVisibleProjects } from "./home.utils";
import type { Project } from "@/lib/projects";

function project(overrides: Partial<Project> = {}): Project {
  return {
    id: "countdown",
    slug: "countdown",
    creationDate: new Date("2026-02-17"),
    disabled: false,
    title: "Countdown Timer",
    type: "project",
    imageSrc: "/images/countdown.svg",
    description: "A calm timer.",
    tags: ["timer", "utility"],
    path: "/countdown/",
    repo: "jakeflavin/countdown",
    ...overrides
  };
}

describe("filterProjects", () => {
  const projects = [
    project(),
    project({ id: "hat", title: "Hat", description: "Random picker.", tags: ["picker"] })
  ];

  it("returns everything when the query is blank", () => {
    expect(filterProjects(projects, "   ")).toHaveLength(2);
  });

  it("matches on title, case-insensitively", () => {
    expect(filterProjects(projects, "COUNTDOWN").map((p) => p.id)).toEqual(["countdown"]);
  });

  it("matches on description", () => {
    expect(filterProjects(projects, "picker").map((p) => p.id)).toEqual(["hat"]);
  });

  it("matches on tags", () => {
    expect(filterProjects(projects, "utility").map((p) => p.id)).toEqual(["countdown"]);
  });

  it("returns nothing when there is no match", () => {
    expect(filterProjects(projects, "nonsense")).toEqual([]);
  });

  it("does not mutate the input", () => {
    const input = [project()];
    filterProjects(input, "");
    expect(input).toHaveLength(1);
  });

  it("keeps disabled projects, so they can show as coming soon", () => {
    const withDisabled = [project({ id: "wip", disabled: true, title: "Work in progress" })];
    expect(filterProjects(withDisabled, "")).toHaveLength(1);
  });
});

describe("sortProjects", () => {
  const older = project({ id: "a", title: "Alpha", creationDate: new Date("2026-01-01") });
  const newer = project({ id: "b", title: "Zulu", creationDate: new Date("2026-06-01") });

  it("sorts by title ascending and descending", () => {
    expect(sortProjects([newer, older], "title-asc").map((p) => p.id)).toEqual(["a", "b"]);
    expect(sortProjects([older, newer], "title-desc").map((p) => p.id)).toEqual(["b", "a"]);
  });

  it("sorts by date ascending and descending", () => {
    expect(sortProjects([newer, older], "date-asc").map((p) => p.id)).toEqual(["a", "b"]);
    expect(sortProjects([older, newer], "date-desc").map((p) => p.id)).toEqual(["b", "a"]);
  });

  it("does not mutate the input array", () => {
    const input = [newer, older];
    sortProjects(input, "title-asc");
    expect(input.map((p) => p.id)).toEqual(["b", "a"]);
  });
});

describe("getVisibleProjects", () => {
  it("puts disabled projects last regardless of sort order", () => {
    const projects = [
      project({ id: "wip", title: "Aaa", disabled: true, creationDate: new Date("2026-07-01") }),
      project({ id: "live", title: "Zzz", disabled: false, creationDate: new Date("2026-01-01") })
    ];

    expect(getVisibleProjects(projects, "", "title-asc").map((p) => p.id)).toEqual(["live", "wip"]);
    expect(getVisibleProjects(projects, "", "date-desc").map((p) => p.id)).toEqual(["live", "wip"]);
  });

  it("applies the filter before sorting", () => {
    const projects = [project({ id: "hat", title: "Hat" }), project()];
    expect(getVisibleProjects(projects, "hat", "title-asc").map((p) => p.id)).toEqual(["hat"]);
  });
});
