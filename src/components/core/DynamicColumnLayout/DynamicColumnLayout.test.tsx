import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "../../../test/test-utils";
import DynamicColumnLayout from "./DynamicColumnLayout";

describe("DynamicColumnLayout", () => {
  beforeEach(() => {
    global.ResizeObserver = class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children inside the layout", () => {
    render(
      <DynamicColumnLayout>
        <div data-testid="child-a">A</div>
        <div data-testid="child-b">B</div>
      </DynamicColumnLayout>
    );
    expect(screen.getByTestId("child-a")).toHaveTextContent("A");
    expect(screen.getByTestId("child-b")).toHaveTextContent("B");
  });

  it("accepts className and passes it to the container", () => {
    const { container } = render(
      <DynamicColumnLayout className="custom-layout">
        <div>Child</div>
      </DynamicColumnLayout>
    );
    const wrapper = container.querySelector(".custom-layout");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders a single column when given one child", () => {
    render(
      <DynamicColumnLayout>
        <span data-testid="only">Only child</span>
      </DynamicColumnLayout>
    );
    expect(screen.getByTestId("only")).toBeInTheDocument();
  });
});
