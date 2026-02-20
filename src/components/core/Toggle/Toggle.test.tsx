import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/test-utils";
import Toggle from "./Toggle";

describe("Toggle", () => {
  it("renders as a switch with unchecked state", () => {
    render(<Toggle checked={false} onChange={() => {}} aria-label="Enable feature" />);
    const switch_ = screen.getByRole("switch", { name: "Enable feature" });
    expect(switch_).toBeInTheDocument();
    expect(switch_).toHaveAttribute("aria-checked", "false");
  });

  it("renders as checked when checked is true", () => {
    render(<Toggle checked onChange={() => {}} aria-label="Enable" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange with true when toggled from unchecked", () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} aria-label="Enable" />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when toggled from checked", () => {
    const onChange = vi.fn();
    render(<Toggle checked onChange={onChange} aria-label="Enable" />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("renders label when provided", () => {
    render(<Toggle checked={false} onChange={() => {}} label="Play against bot" />);
    expect(screen.getByText("Play against bot")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-labelledby");
  });

  it("is disabled when disabled prop is true", () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} disabled aria-label="Enable" />);
    const switch_ = screen.getByRole("switch");
    expect(switch_).toBeDisabled();
    fireEvent.click(switch_);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("accepts className", () => {
    const { container } = render(
      <Toggle checked={false} onChange={() => {}} className="custom-toggle" aria-label="Enable" />
    );
    expect(container.querySelector(".custom-toggle")).toBeInTheDocument();
  });
});
