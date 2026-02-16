import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { render, screen } from "../../../test/test-utils";
import TypeWriter from "./TypeWriter";

describe("TypeWriter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders wrapper and cursor", () => {
    render(<TypeWriter sentences={["Hello"]} typingSpeed={99999} />);
    expect(screen.getByText("|")).toBeInTheDocument();
  });

  it("starts with empty display text", () => {
    render(<TypeWriter sentences={["Hi"]} typingSpeed={99999} />);
    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
  });

  it("types first character after first tick", () => {
    render(<TypeWriter sentences={["Hi"]} typingSpeed={100} />);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByText("H")).toBeInTheDocument();
  });

  it("types full sentence when advanced through timers", () => {
    render(<TypeWriter sentences={["Hi"]} typingSpeed={10} />);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByText("H")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });

  it("accepts multiple sentences", () => {
    render(
      <TypeWriter
        sentences={["One", "Two"]}
        typingSpeed={1000}
      />
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("O")).toBeInTheDocument();
  });
});
