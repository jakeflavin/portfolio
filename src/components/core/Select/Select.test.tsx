import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/test-utils";
import Select from "./Select";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" }
];

describe("Select", () => {
  it("renders trigger and shows options when opened", () => {
    render(<Select options={options} placeholder="Choose…" aria-label="Choose" />);
    expect(screen.getByRole("combobox", { name: "Choose" })).toHaveTextContent("Choose…");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option A" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option B" })).toBeInTheDocument();
  });

  it("calls onChange when an option is clicked", () => {
    const onChange = vi.fn();
    render(
      <Select options={options} onChange={onChange} aria-label="Choose" />
    );
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Option B" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("shows placeholder when provided", () => {
    render(
      <Select
        options={options}
        placeholder="Select one…"
        aria-label="Choose"
      />
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Select one…");
  });

  it("renders disabled when disabled prop is true", () => {
    render(<Select options={options} disabled aria-label="Choose" />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <Select options={options} className="custom-select" aria-label="Choose" />
    );
    expect(container.querySelector(".custom-select")).toBeInTheDocument();
  });

  it("shows selected value label when value is set", () => {
    render(
      <Select options={options} value="b" aria-label="Choose" />
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("Option B");
  });

  it("renders error message and applies error state when error prop is set", () => {
    render(
      <Select
        options={options}
        placeholder="Select…"
        aria-label="Category"
        error="Please select a category."
      />
    );
    expect(screen.getByText("Please select a category.")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });
});
