import React, { useState, useEffect, useRef, useMemo } from "react";
import { Wrapper, Segment, AnimatedValue, Separator } from "./CountdownTimer.styled";

function toTotalSeconds(h: number, m: number, s: number): number {
  return h * 3600 + m * 60 + s;
}

function fromTotalSeconds(total: number): { h: number; m: number; s: number } {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { h, m, s };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export interface CountdownTimerProps {
  /** Initial hours (0–99). */
  hours?: number;
  /** Initial minutes (0–59). */
  minutes?: number;
  /** Initial seconds (0–59). */
  seconds?: number;
  /** When true, the countdown runs; when false, it is paused. */
  play?: boolean;
  /** Optional callback when countdown reaches zero. */
  onComplete?: () => void;
  /** Optional class name for the wrapper. */
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  hours = 0,
  minutes = 0,
  seconds = 0,
  play = false,
  onComplete,
  className
}) => {
  const initialTotal = useMemo(
    () => toTotalSeconds(hours, minutes, seconds),
    [hours, minutes, seconds]
  );

  const [remaining, setRemaining] = useState(initialTotal);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Reset remaining when initial duration props change
  useEffect(() => {
    setRemaining(initialTotal);
  }, [initialTotal]);

  // Count down when play is true
  useEffect(() => {
    if (!play || remaining <= 0) return;

    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [play, remaining]);

  const { h, m, s } = fromTotalSeconds(remaining);

  return (
    <Wrapper className={className} role="timer" aria-live="polite">
      <Segment>
        <AnimatedValue key={h}>{pad(h)}</AnimatedValue>
      </Segment>
      <Separator aria-hidden="true">:</Separator>
      <Segment>
        <AnimatedValue key={m}>{pad(m)}</AnimatedValue>
      </Segment>
      <Separator aria-hidden="true">:</Separator>
      <Segment>
        <AnimatedValue key={s}>{pad(s)}</AnimatedValue>
      </Segment>
    </Wrapper>
  );
};

export default CountdownTimer;
