import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import Card from "./Card";

describe("Card", () => {
  const defaultProps = {
    title: "Test Project",
    imageSrc: "/test.png",
    description: "A test description"
  };

  it("renders the title as a heading, plus the image and caption", () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByRole("heading", { name: "Test Project" })).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/test.png");
    // The caption leads with the title in bold, the way an Instagram caption does.
    expect(screen.getByText(/A test description/)).toBeInTheDocument();
  });

  it("renders tags as hashtags", () => {
    render(<Card {...defaultProps} tags={["React", "type script"]} />);
    // Whitespace is stripped so each tag is a single hashtag token.
    expect(screen.getByText("#React #typescript")).toBeInTheDocument();
  });

  it("renders no hashtag line when there are no tags", () => {
    render(<Card {...defaultProps} />);
    expect(screen.queryByText(/^#/)).not.toBeInTheDocument();
  });

  it("renders a link when href is provided", () => {
    render(<Card {...defaultProps} href="/countdown/" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/countdown/");
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

  it("formats the timestamp in UTC so a plain date is not shown a day early", () => {
    render(<Card {...defaultProps} date={new Date("2026-02-17")} />);
    expect(screen.getByText("February 17, 2026")).toBeInTheDocument();
  });
});
