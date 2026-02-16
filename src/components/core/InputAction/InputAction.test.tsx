import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/test-utils";
import InputAction from "./InputAction";

const MockIcon = () => <svg data-testid="mock-icon" />;

describe("InputAction", () => {
  it("renders input with left icon and optional action button", () => {
    render(
      <InputAction
        icon={<MockIcon />}
        placeholder="Search..."
        onAction={() => {}}
        actionAriaLabel="Search"
      />
    );
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-icon").length).toBeGreaterThanOrEqual(1);
  });

  it("displays controlled value and clear button when non-empty", () => {
    render(
      <InputAction
        icon={<MockIcon />}
        value="typed value"
        onChange={() => {}}
      />
    );
    expect(screen.getByDisplayValue("typed value")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear input" })).toBeInTheDocument();
  });

  it("calls onChange when input changes", () => {
    const onChange = vi.fn();
    render(
      <InputAction
        icon={<MockIcon />}
        onChange={onChange}
        actionAriaLabel="Action"
      />
    );
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("calls onAction when action button is clicked", () => {
    const onAction = vi.fn();
    render(
      <InputAction
        icon={<MockIcon />}
        onAction={onAction}
        actionAriaLabel="Submit"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("clears input when clear button is clicked", () => {
    const onChange = vi.fn();
    render(
      <InputAction
        icon={<MockIcon />}
        value="some text"
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear input" }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: "" }) })
    );
  });
});
