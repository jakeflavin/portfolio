import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@/test/test-utils";
import Home from "./Home";
import { PROJECTS } from "@/features/projects/projects";

describe("Home", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const grid = () => screen.getAllByRole("link");

  it("renders a card per project, each linking to its sub-path", () => {
    render(<Home />);
    const links = grid();
    expect(links).toHaveLength(PROJECTS.filter((p) => !p.disabled).length);

    for (const project of PROJECTS.filter((p) => !p.disabled)) {
      const link = links.find((element) => element.getAttribute("href") === project.path);
      expect(link, `no card links to ${project.path}`).toBeDefined();
      expect(
        within(link!).getByRole("heading", { name: project.title })
      ).toBeInTheDocument();
    }
  });

  it("filters the grid as you type", () => {
    render(<Home />);
    const input = screen.getByPlaceholderText("Search for a project...");

    fireEvent.change(input, { target: { value: PROJECTS[0].title } });

    expect(grid()).toHaveLength(1);
    expect(grid()[0]).toHaveAttribute("href", PROJECTS[0].path);
  });

  it("shows an empty state when nothing matches", () => {
    render(<Home />);
    const input = screen.getByPlaceholderText("Search for a project...");

    fireEvent.change(input, { target: { value: "zzzz-no-such-project" } });

    expect(screen.getByText("No projects found")).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("recovers when the search is cleared", () => {
    render(<Home />);
    const input = screen.getByPlaceholderText("Search for a project...");

    fireEvent.change(input, { target: { value: "zzzz" } });
    fireEvent.change(input, { target: { value: "" } });

    expect(screen.queryByText("No projects found")).not.toBeInTheDocument();
    expect(grid().length).toBeGreaterThan(0);
  });
});
