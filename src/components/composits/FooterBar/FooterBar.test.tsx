import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/test-utils";
import FooterBar from "./FooterBar";

describe("FooterBar", () => {
  it("renders footer text", () => {
    render(<FooterBar />);
    expect(screen.getByText(/Made with.*Jake Flavin/)).toBeInTheDocument();
  });

  it("contains heart character", () => {
    render(<FooterBar />);
    expect(screen.getByText(/♥/)).toBeInTheDocument();
  });
});
