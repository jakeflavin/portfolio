import React from "react";
import { Wrapper, Segment, AnimatedValue, Separator } from "./CountdownTimer.styled";
import { padTimePart } from "./countdownTimer.utils";
import { useCountdownTimer } from "./useCountdownTimer";

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
  const { h, m, s } = useCountdownTimer({ hours, minutes, seconds, play, onComplete });

  return (
    <Wrapper className={className} role="timer" aria-live="polite">
      <Segment>
        <AnimatedValue key={h}>{padTimePart(h)}</AnimatedValue>
      </Segment>
      <Separator aria-hidden="true">:</Separator>
      <Segment>
        <AnimatedValue key={m}>{padTimePart(m)}</AnimatedValue>
      </Segment>
      <Separator aria-hidden="true">:</Separator>
      <Segment>
        <AnimatedValue key={s}>{padTimePart(s)}</AnimatedValue>
      </Segment>
    </Wrapper>
  );
};

export default CountdownTimer;
