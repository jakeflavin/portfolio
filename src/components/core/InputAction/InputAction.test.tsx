import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/test-utils";
import InputAction from "./InputAction";

const MockIcon = () => <svg data-testid="mock-icon" />;

describe("InputAction", () => {
  it("renders input and action button with icon", () => {
    render(
      <InputAction
        icon={<MockIcon />}
        placeholder="Search..."
        actionAriaLabel="Search"
      />
    );
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("displays controlled value", () => {
    render(
      <InputAction
        icon={<MockIcon />}
        value="typed value"
        onChange={() => {}}
        actionAriaLabel="Action"
      />
    );
    expect(screen.getByDisplayValue("typed value")).toBeInTheDocument();
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
});
