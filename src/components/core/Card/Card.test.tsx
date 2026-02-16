import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../../test/test-utils";
import Card from "./Card";

describe("Card", () => {
  const defaultProps = {
    title: "Test Project",
    imageSrc: "/test.png",
    description: "A test description"
  };

  it("renders title, image, and description", () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/test.png");
    expect(screen.getByText("A test description")).toBeInTheDocument();
  });

  it("renders tags when provided", () => {
    render(<Card {...defaultProps} tags={["React", "TypeScript"]} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("does not render role button when onAction is not provided", () => {
    render(<Card {...defaultProps} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders as button and calls onAction when clicked", () => {
    const onAction = vi.fn();
    render(<Card {...defaultProps} onAction={onAction} />);
    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("calls onAction on Enter key", () => {
    const onAction = vi.fn();
    render(<Card {...defaultProps} onAction={onAction} />);
    const card = screen.getByRole("button");
    card.focus();
    fireEvent.keyDown(card, { key: "Enter", code: "Enter" });
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("calls onAction on Space key", () => {
    const onAction = vi.fn();
    render(<Card {...defaultProps} onAction={onAction} />);
    const card = screen.getByRole("button");
    card.focus();
    fireEvent.keyDown(card, { key: " ", code: "Space" });
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
