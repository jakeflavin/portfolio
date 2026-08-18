import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import NavBar from "./NavBar";

function renderNavBar(props = {}) {
  return render(<NavBar {...props} />);
}

describe("NavBar", () => {
  it("does not render a home button, since the directory is the only page", () => {
    renderNavBar();
    expect(screen.queryByRole("button", { name: "Go to home" })).not.toBeInTheDocument();
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
