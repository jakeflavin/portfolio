import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/test-utils";
import { Card } from "./Card";

describe("Card", () => {
  const defaultProps = {
    title: "Test Project",
    imageSrc: "/test.png",
    description: "A test description"
  };

  it("renders the title once, plus the media and caption", () => {
    render(<Card {...defaultProps} />);
    // The title belongs in the header only; repeating it in the caption read as noise.
    expect(screen.getAllByText("Test Project")).toHaveLength(1);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/test.png");
    // The caption leads with the title in bold, the way an Instagram caption does.
    expect(screen.getByText(/A test description/)).toBeInTheDocument();
  });

  it("renders each tag as its own hashtag", () => {
    render(<Card {...defaultProps} tags={["React", "type script"]} />);
    // Whitespace is stripped so each tag stays a single token.
    expect(screen.getByRole("button", { name: "Filter by React" })).toHaveTextContent(
      "#React"
    );
    expect(
      screen.getByRole("button", { name: "Filter by type script" })
    ).toHaveTextContent("#typescript");
  });

  it("reports the tag when a chip is clicked", () => {
    const onTagClick = vi.fn();
    render(<Card {...defaultProps} tags={["type script"]} onTagClick={onTagClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Filter by type script" }));
    expect(onTagClick).toHaveBeenCalledWith("type script");
  });

  it("renders no verified badge", () => {
    render(<Card {...defaultProps} href="/hat/" />);
    expect(screen.queryByLabelText("Live")).not.toBeInTheDocument();
  });

  it("renders no hashtags when there are no tags", () => {
    render(<Card {...defaultProps} />);
    expect(screen.queryByRole("button", { name: /^Filter by/ })).not.toBeInTheDocument();
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
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
  });
});
