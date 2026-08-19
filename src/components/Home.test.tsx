import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@/test/test-utils";
import Home from "./Home";
import { PROJECTS } from "@/lib/projects";

describe("Home", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Each post has several links (title, media, actions), so count posts by article.
  const posts = () => screen.queryAllByRole("article");

  it("renders a card per project, each linking to its sub-path", () => {
    render(<Home />);
    expect(posts()).toHaveLength(PROJECTS.length);

    for (const project of PROJECTS) {
      const post = posts().find(
        (element) => within(element).queryAllByText(project.title).length > 0
      );
      expect(post, `no post for ${project.title}`).toBeDefined();

      if (!project.disabled) {
        expect(
          within(post!).getByRole("link", { name: project.title })
        ).toHaveAttribute("href", project.path);
      }
    }
  });

  it("filters the grid as you type", () => {
    // Indexed reads are checked, and this test is meaningless without a project to filter
    // to — so the fixture is asserted here rather than asserted away at each use.
    const [project] = PROJECTS;
    if (!project) throw new Error("PROJECTS is empty; this test needs at least one app");

    render(<Home />);
    const input = screen.getByPlaceholderText("Search");

    fireEvent.change(input, { target: { value: project.title } });

    const [match] = posts();
    expect(posts()).toHaveLength(1);
    if (!match) throw new Error("expected the filtered grid to contain one post");
    expect(within(match).getAllByText(project.title).length).toBeGreaterThan(0);
  });

  it("shows an empty state when nothing matches", () => {
    render(<Home />);
    const input = screen.getByPlaceholderText("Search");

    fireEvent.change(input, { target: { value: "zzzz-no-such-project" } });

    expect(screen.getByText("No projects found")).toBeInTheDocument();
    expect(posts()).toHaveLength(0);
  });

  it("recovers when the search is cleared", () => {
    render(<Home />);
    const input = screen.getByPlaceholderText("Search");

    fireEvent.change(input, { target: { value: "zzzz" } });
    fireEvent.change(input, { target: { value: "" } });

    expect(screen.queryByText("No projects found")).not.toBeInTheDocument();
    expect(posts().length).toBeGreaterThan(0);
  });

});
