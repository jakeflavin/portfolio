import { useState } from "react";

export function useCountdownPage() {
  const [play, setPlay] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  return {
    hours,
    minutes,
    play,
    seconds,
    setHours,
    setMinutes,
    setSeconds,
    togglePlay: () => setPlay((prev) => !prev)
  };
}
