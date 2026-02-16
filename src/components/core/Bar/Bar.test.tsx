import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/test-utils";
import Bar from "./Bar";

describe("Bar", () => {
  it("renders children", () => {
    render(<Bar>Bar content</Bar>);
    expect(screen.getByText("Bar content")).toBeInTheDocument();
  });

  it("renders with align center by default", () => {
    const { container } = render(<Bar>Content</Bar>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with align space-between when specified", () => {
    render(
      <Bar align="space-between">
        <span>Left</span>
        <span>Right</span>
      </Bar>
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });
});
