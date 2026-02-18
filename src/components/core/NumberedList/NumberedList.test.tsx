import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/test-utils";
import NumberedList from "./NumberedList";

describe("NumberedList", () => {
  it("renders title, description, and total count", () => {
    render(
      <NumberedList
        title="My list"
        description="Optional description."
        truncate={2}
      >
        <span>One</span>
        <span>Two</span>
      </NumberedList>
    );
    expect(screen.getByRole("heading", { name: "My list" })).toBeInTheDocument();
    expect(screen.getByText("Optional description.")).toBeInTheDocument();
    expect(screen.getByLabelText("2 items")).toBeInTheDocument();
  });

  it("shows only truncate number of items initially when list is longer", () => {
    render(
      <NumberedList title="List" description="Desc" truncate={2}>
        <span data-testid="item-1">A</span>
        <span data-testid="item-2">B</span>
        <span data-testid="item-3">C</span>
      </NumberedList>
    );
    expect(screen.getByTestId("item-1")).toBeInTheDocument();
    expect(screen.getByTestId("item-2")).toBeInTheDocument();
    expect(screen.queryByTestId("item-3")).not.toBeInTheDocument();
  });

  it('shows full list after clicking expand button', () => {
    render(
      <NumberedList title="List" description="Desc" truncate={2}>
        <span data-testid="item-1">A</span>
        <span data-testid="item-2">B</span>
        <span data-testid="item-3">C</span>
      </NumberedList>
    );
    fireEvent.click(screen.getByRole("button", { name: /more/i }));
    expect(screen.getByTestId("item-3")).toBeInTheDocument();
  });

  it('shows collapse button when expanded and collapses on click', () => {
    render(
      <NumberedList title="List" description="Desc" truncate={2}>
        <span data-testid="item-1">A</span>
        <span data-testid="item-2">B</span>
        <span data-testid="item-3">C</span>
      </NumberedList>
    );
    fireEvent.click(screen.getByRole("button", { name: /more/i }));
    expect(screen.getByRole("button", { name: /less/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /less/i }));
    expect(screen.queryByTestId("item-3")).not.toBeInTheDocument();
  });

  it("does not show expand button when list length is less than or equal to truncate", () => {
    render(
      <NumberedList title="List" description="Desc" truncate={5}>
        <span>A</span>
        <span>B</span>
      </NumberedList>
    );
    expect(screen.queryByRole("button", { name: /more/i })).not.toBeInTheDocument();
  });
});
