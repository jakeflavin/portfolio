import { useEffect, useMemo, useRef, useState } from "react";
import { fromTotalSeconds, toTotalSeconds } from "./countdownTimer.utils";

interface UseCountdownTimerOptions {
  hours: number;
  minutes: number;
  seconds: number;
  play: boolean;
  onComplete?: () => void;
}

export function useCountdownTimer({
  hours,
  minutes,
  seconds,
  play,
  onComplete
}: UseCountdownTimerOptions) {
  const initialTotal = useMemo(
    () => toTotalSeconds(hours, minutes, seconds),
    [hours, minutes, seconds]
  );

  const [remaining, setRemaining] = useState(initialTotal);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setRemaining(initialTotal);
  }, [initialTotal]);

  useEffect(() => {
    if (!play || remaining <= 0) return;

    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          onCompleteRef.current?.();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [play, remaining]);

  return fromTotalSeconds(remaining);
}
