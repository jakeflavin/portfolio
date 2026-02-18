import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "../../../test/test-utils";
import ProjectPageMeta from "./ProjectPageMeta";
import type { Project } from "../../../pages/data/projects";

const mockProject: Project = {
  id: "test-1",
  creationDate: new Date("2026-01-01"),
  disabled: false,
  title: "Test Project",
  type: "project",
  imageSrc: "/images/test.png",
  description: "A test project description.",
  path: "/projects/test",
  external: false
};

describe("ProjectPageMeta", () => {
  const originalTitle = document.title;

  beforeEach(() => {
    document.title = "Jake's Portfolio";
  });

  afterEach(() => {
    document.title = originalTitle;
  });

  it("renders children", () => {
    render(
      <ProjectPageMeta project={mockProject}>
        <span data-testid="child">Page content</span>
      </ProjectPageMeta>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Page content");
  });

  it("sets document title to project title and site title", () => {
    render(
      <ProjectPageMeta project={mockProject}>
        <div />
      </ProjectPageMeta>
    );
    expect(document.title).toBe("Test Project | Jake's Portfolio");
  });

  it("restores document title on unmount", () => {
    const { unmount } = render(
      <ProjectPageMeta project={mockProject}>
        <div />
      </ProjectPageMeta>
    );
    expect(document.title).toBe("Test Project | Jake's Portfolio");
    unmount();
    expect(document.title).toBe("Jake's Portfolio");
  });
});
