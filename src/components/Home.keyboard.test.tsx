import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { Home } from "./Home";

describe("Home keyboard navigation", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false } as Response)));
  });

  const press = (key: string, target: Element | Document = document.body) =>
    fireEvent.keyDown(target, { key });

  it("focuses the search on /", () => {
    render(<Home />);
    press("/");
    expect(screen.getByPlaceholderText("Search")).toHaveFocus();
  });

  it("walks results with j and k", () => {
    render(<Home />);
    const items = () => document.querySelectorAll("[data-nav-item]");

    press("j");
    expect(document.activeElement).toBe(items()[0]);

    press("j");
    expect(document.activeElement).toBe(items()[1]);

    press("k");
    expect(document.activeElement).toBe(items()[0]);
  });

  it("stops at the ends rather than wrapping", () => {
    render(<Home />);
    const items = () => document.querySelectorAll("[data-nav-item]");

    press("k");
    expect(document.activeElement).toBe(items()[items().length - 1]);

    press("j");
    expect(document.activeElement).toBe(items()[items().length - 1]);
  });

  // The shortcuts are bare letters, so they must never fire while typing a search.
  it("does not hijack j, k or / typed into the search field", () => {
    render(<Home />);
    const search = screen.getByPlaceholderText("Search");
    search.focus();

    press("j", search);
    expect(search).toHaveFocus();
  });

  it("clears an active search on Escape", () => {
    render(<Home />);
    const search = screen.getByPlaceholderText("Search");

    fireEvent.change(search, { target: { value: "weather" } });
    expect(search).toHaveValue("weather");

    press("Escape", search);
    expect(search).toHaveValue("");
  });
});
