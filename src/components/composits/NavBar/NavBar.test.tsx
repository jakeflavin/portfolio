import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/test-utils";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar";

function renderNavBar(props = {}) {
  return render(
    <MemoryRouter>
      <NavBar {...props} />
    </MemoryRouter>
  );
}

describe("NavBar", () => {
  it("renders home button with aria label", () => {
    renderNavBar();
    expect(screen.getByRole("button", { name: "Go to home" })).toBeInTheDocument();
  });

  it("renders LinkedIn and GitHub buttons", () => {
    renderNavBar();
    expect(screen.getByRole("button", { name: "Open LinkedIn profile" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open GitHub profile" })).toBeInTheDocument();
  });

  it("renders dark mode toggle button", () => {
    renderNavBar();
    expect(screen.getByRole("button", { name: "Toggle dark mode" })).toBeInTheDocument();
  });

  it("calls onToggleDarkMode when dark mode button is clicked", () => {
    const onToggleDarkMode = vi.fn();
    renderNavBar({ onToggleDarkMode });
    fireEvent.click(screen.getByRole("button", { name: "Toggle dark mode" }));
    expect(onToggleDarkMode).toHaveBeenCalledTimes(1);
  });
});
