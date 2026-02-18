import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/test-utils";
import Link from "./Link";

describe("Link", () => {
  it("renders title and links to url", () => {
    render(<Link title="Example" url="https://example.com" />);
    expect(screen.getByText("Example")).toBeInTheDocument();
    const anchor = screen.getByRole("link");
    expect(anchor).toHaveAttribute("href", "https://example.com");
  });

  it("renders favicon image when url is valid", () => {
    render(<Link title="Test" url="https://github.com" />);
    const img = document.querySelector('img[alt=""]');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", expect.stringContaining("google.com/s2/favicons"));
  });

  it("opens in new tab when openInNewTab is true", () => {
    render(<Link title="External" url="https://external.com" openInNewTab />);
    const anchor = screen.getByRole("link");
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not have target when openInNewTab is false", () => {
    render(<Link title="Same tab" url="https://same.com" />);
    expect(screen.getByRole("link")).not.toHaveAttribute("target");
  });
});
