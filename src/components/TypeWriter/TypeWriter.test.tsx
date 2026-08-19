import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { render, screen } from "@/test/test-utils";
import { TypeWriter } from "./TypeWriter";

/** jitter off throughout, so a tick is exactly one keystroke. */
const base = { typingSpeed: 10, deletingSpeed: 10, restartDelay: 0, jitter: false };

describe("TypeWriter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * One act() per tick. Each keystroke schedules the next only after React re-renders, so
   * a single large advanceTimersByTime fires the first timer and then finds nothing queued.
   */
  const ticks = (count: number, ms = 10) => {
    for (let index = 0; index < count; index += 1) {
      act(() => {
        vi.advanceTimersByTime(ms);
      });
    }
  };

  const tick = (ms: number) =>
    act(() => {
      vi.advanceTimersByTime(ms);
    });

  it("renders the cursor and starts empty", () => {
    render(<TypeWriter {...base} script={[{ type: "Hi" }]} />);
    expect(screen.getByText("|")).toBeInTheDocument();
    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
  });

  it("types one character per tick", () => {
    render(<TypeWriter {...base} script={[{ type: "Hi" }]} />);
    ticks(1);
    expect(screen.getByText("H")).toBeInTheDocument();
    ticks(1);
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });

  it("backspaces the requested number of characters", () => {
    render(<TypeWriter {...base} script={[{ type: "abcd" }, { delete: 2 }]} />);
    ticks(4);
    expect(screen.getByText("abcd")).toBeInTheDocument();
    ticks(2);
    expect(screen.getByText("ab")).toBeInTheDocument();
  });

  it("types a correction after a backspace, as a typo fix would", () => {
    render(
      <TypeWriter {...base} script={[{ type: "biuld" }, { delete: 5 }, { type: "build" }]} />
    );
    ticks(15);
    expect(screen.getByText("build")).toBeInTheDocument();
  });

  it("holds on a pause step without changing the text", () => {
    render(<TypeWriter {...base} script={[{ type: "ab" }, { pause: 500 }, { type: "c" }]} />);
    ticks(2);
    expect(screen.getByText("ab")).toBeInTheDocument();
    tick(100);
    expect(screen.getByText("ab")).toBeInTheDocument();
    tick(400);
    ticks(1);
    expect(screen.getByText("abc")).toBeInTheDocument();
  });

  it("leaves the finished text up when restartDelay is 0", () => {
    render(<TypeWriter {...base} script={[{ type: "done" }]} />);
    ticks(4);
    tick(10_000);
    expect(screen.getByText("done")).toBeInTheDocument();
  });

  it("replays from empty once restartDelay elapses", () => {
    render(<TypeWriter {...base} restartDelay={200} script={[{ type: "ab" }]} />);
    ticks(2);
    expect(screen.getByText("ab")).toBeInTheDocument();
    tick(200);
    expect(screen.queryByText("ab")).not.toBeInTheDocument();
    ticks(2);
    expect(screen.getByText("ab")).toBeInTheDocument();
  });

  it("does not stall on a zero-length step", () => {
    render(<TypeWriter {...base} script={[{ type: "" }, { delete: 0 }, { type: "ok" }]} />);
    ticks(4);
    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});
