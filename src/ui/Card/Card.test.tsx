import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
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

  it("renders a link when href is provided", () => {
    render(<Card {...defaultProps} href="/countdown/" />);
    const link = screen.getByRole("link", { name: /test project/i });
    expect(link).toHaveAttribute("href", "/countdown/");
  });

  it("does not render a link when href is omitted", () => {
    render(<Card {...defaultProps} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("drops the link and marks the card disabled when disabled", () => {
    render(<Card {...defaultProps} href="/countdown/" disabled />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("coming soon")).toBeInTheDocument();
  });
});
