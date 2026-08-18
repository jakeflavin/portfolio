import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@/test/test-utils";
import Home from "./Home";
import { PROJECTS } from "@/features/projects/projects";

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
    render(<Home />);
    const input = screen.getByPlaceholderText("Search");

    fireEvent.change(input, { target: { value: PROJECTS[0].title } });

    expect(posts()).toHaveLength(1);
    expect(within(posts()[0]).getAllByText(PROJECTS[0].title).length).toBeGreaterThan(0);
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

  describe("view tabs", () => {
    const tab = (name: RegExp) => screen.getByRole("tab", { name });

    it("shows the feed by default", () => {
      render(<Home />);
      expect(tab(/feed/i)).toHaveAttribute("aria-selected", "true");
      expect(posts().length).toBeGreaterThan(0);
    });

    it("switches to the grid and drops the post chrome", () => {
      render(<Home />);
      fireEvent.click(tab(/grid/i));

      expect(tab(/grid/i)).toHaveAttribute("aria-selected", "true");
      expect(posts()).toHaveLength(0);
      // Every live project is still reachable, just as a tile.
      for (const project of PROJECTS.filter((p) => !p.disabled)) {
        expect(
          screen.getByRole("link", { name: `Open ${project.title}` })
        ).toHaveAttribute("href", project.path);
      }
    });

    it("remembers the choice across mounts", () => {
      const first = render(<Home />);
      fireEvent.click(tab(/grid/i));
      first.unmount();

      render(<Home />);
      expect(tab(/grid/i)).toHaveAttribute("aria-selected", "true");
    });

    it("keeps filtering the grid, not just the feed", () => {
      render(<Home />);
      fireEvent.click(tab(/grid/i));
      fireEvent.change(screen.getByPlaceholderText("Search"), {
        target: { value: PROJECTS[0].title }
      });

      expect(screen.getAllByRole("link")).toHaveLength(1);
    });
  });
});
