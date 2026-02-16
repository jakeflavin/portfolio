import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/test-utils";
import IconButton from "./IconButton";

const MockIcon = () => <svg data-testid="mock-icon" />;

describe("IconButton", () => {
  it("renders the icon", () => {
    render(<IconButton icon={<MockIcon />} />);
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("applies aria-label when provided", () => {
    render(<IconButton icon={<MockIcon />} ariaLabel="Close" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<IconButton icon={<MockIcon />} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders active icon when active and activeIcon provided", () => {
    const ActiveIcon = () => <svg data-testid="active-icon" />;
    render(
      <IconButton
        icon={<MockIcon />}
        activeIcon={<ActiveIcon />}
        active={true}
      />
    );
    expect(screen.getByTestId("active-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
  });

  it("renders default icon when active is false", () => {
    const ActiveIcon = () => <svg data-testid="active-icon" />;
    render(
      <IconButton
        icon={<MockIcon />}
        activeIcon={<ActiveIcon />}
        active={false}
      />
    );
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("active-icon")).not.toBeInTheDocument();
  });
});
