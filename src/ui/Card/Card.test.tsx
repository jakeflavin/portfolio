import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import Card from "./Card";

describe("Card", () => {
  const defaultProps = {
    title: "Test Project",
    imageSrc: "/test.png",
    description: "A test description"
  };

  it("renders the title, media and caption", () => {
    render(<Card {...defaultProps} />);
    // The title appears twice by design: in the header and again opening the caption,
    // which is exactly how a post reads.
    expect(screen.getAllByText("Test Project")).toHaveLength(2);
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

  it("links the title and media to the app, and offers an open action", () => {
    render(<Card {...defaultProps} href="/countdown/" />);

    const titleLink = screen.getByRole("link", { name: "Test Project" });
    expect(titleLink).toHaveAttribute("href", "/countdown/");
    expect(screen.getByRole("link", { name: "Open Test Project" })).toHaveAttribute(
      "href",
      "/countdown/"
    );
  });

  it("links to the repository when one is given", () => {
    render(<Card {...defaultProps} href="/countdown/" repo="jakeflavin/countdown" />);
    expect(screen.getByRole("link", { name: /view source/i })).toHaveAttribute(
      "href",
      "https://github.com/jakeflavin/countdown"
    );
  });

  it("renders no links at all when href is omitted", () => {
    render(<Card {...defaultProps} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("drops the links and marks the card disabled when disabled", () => {
    render(<Card {...defaultProps} href="/countdown/" disabled />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByText("coming soon")).toBeInTheDocument();
  });
});
