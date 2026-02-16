import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { render, screen } from "../../../test/test-utils";
import Hero from "./Hero";

describe("Hero", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders TypeWriter with cursor", () => {
    render(<Hero />);
    expect(screen.getByText("|")).toBeInTheDocument();
  });

  it("shows typing after advancing timers", () => {
    render(<Hero />);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByText("H")).toBeInTheDocument();
  });
});
