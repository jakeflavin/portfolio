import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@/test/test-utils";
import Home from "./Home";
import { PROJECTS } from "@/lib/projects";

describe("Home layouts", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
    // The manifest only exists on a deployed build; the directory must render without it.
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false } as Response)));
  });

  const switchTo = (label: string) =>
    fireEvent.click(screen.getByRole("button", { name: `${label} view` }));

  it("starts in cards view", () => {
    render(<Home />);
    expect(screen.queryAllByRole("article")).toHaveLength(PROJECTS.length);
  });

  it("shows every project as a tile in grid view, and drops the captions", () => {
    render(<Home />);
    switchTo("Grid");

    expect(screen.queryAllByRole("article")).toHaveLength(0);
    for (const project of PROJECTS.filter((p) => !p.disabled)) {
      expect(screen.getByRole("link", { name: project.title })).toHaveAttribute(
        "href",
        project.path
      );
    }
  });

  it("shows one row per project in list view", () => {
    render(<Home />);
    switchTo("List");

    for (const project of PROJECTS.filter((p) => !p.disabled)) {
      const row = screen.getByRole("link", { name: project.title });
      expect(within(row).getByText(project.description)).toBeInTheDocument();
    }
  });

  it("records the layout in the URL, and leaves the default out of it", () => {
    render(<Home />);

    switchTo("Grid");
    expect(window.location.search).toBe("?view=grid");

    switchTo("Cards");
    expect(window.location.search).toBe("");
  });

  it("keeps the search in the URL so a filtered directory can be linked to", () => {
    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "weather" }
    });
    expect(window.location.search).toBe("?q=weather");
  });

  it("restores state from the URL on load", () => {
    window.history.replaceState(null, "", "/?q=weather&view=list");
    render(<Home />);

    expect(screen.getByPlaceholderText("Search")).toHaveValue("weather");
    expect(screen.getByRole("button", { name: "List view" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
