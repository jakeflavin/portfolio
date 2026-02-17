import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "../../../test/test-utils";
import CountdownTimer from "./CountdownTimer";

describe("CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders initial time from props", () => {
    render(
      <CountdownTimer hours={1} minutes={5} seconds={9} />
    );
    expect(screen.getByRole("timer")).toHaveTextContent("01:05:09");
  });

  it("pads single digits with zero", () => {
    render(
      <CountdownTimer hours={0} minutes={5} seconds={3} />
    );
    expect(screen.getByRole("timer")).toHaveTextContent("00:05:03");
  });

  it("does not count down when play is false", () => {
    render(
      <CountdownTimer minutes={1} seconds={30} play={false} />
    );
    expect(screen.getByRole("timer")).toHaveTextContent("00:01:30");
    vi.advanceTimersByTime(5000);
    expect(screen.getByRole("timer")).toHaveTextContent("00:01:30");
  });

  it("counts down when play is true", async () => {
    render(
      <CountdownTimer minutes={0} seconds={3} play />
    );
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:03");
    await act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:02");
    await act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:01");
    await act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");
  });

  it("calls onComplete when countdown reaches zero", async () => {
    const onComplete = vi.fn();
    render(
      <CountdownTimer minutes={0} seconds={2} play onComplete={onComplete} />
    );
    await act(() => { vi.advanceTimersByTime(2000); });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("stops at zero and does not go negative", async () => {
    render(
      <CountdownTimer minutes={0} seconds={1} play />
    );
    await act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");
    await act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");
  });

  it("accepts className", () => {
    const { container } = render(
      <CountdownTimer seconds={10} className="custom-timer" />
    );
    expect(container.querySelector(".custom-timer")).toBeInTheDocument();
  });
});
