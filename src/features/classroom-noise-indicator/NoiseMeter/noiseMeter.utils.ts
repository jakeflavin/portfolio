import type { NoiseTone } from "./NoiseMeter.styled";

export interface MeterState {
  emoji: string;
  title: string;
  description: string;
}

export function clampLevel(level: number): number {
  return Math.max(0, Math.min(100, Math.round(level)));
}

export function getMeterState(level: number, isListening: boolean): MeterState {
  if (!isListening) {
    return {
      emoji: "😴",
      title: "Meter paused",
      description: "Start listening when the classroom is ready."
    };
  }

  if (level < 35) {
    return {
      emoji: "😊",
      title: "Nice and focused",
      description: "This is a great working volume."
    };
  }

  if (level < 55) {
    return {
      emoji: "🙂",
      title: "Getting lively",
      description: "Still okay, but voices are climbing."
    };
  }

  if (level < 75) {
    return {
      emoji: "😬",
      title: "Too loud",
      description: "Bring it down before it gets wild."
    };
  }

  return {
    emoji: "😵",
    title: "Volume alert",
    description: "Time for quiet voices."
  };
}

export function getNoiseTone(value: number): NoiseTone {
  if (value < 45) return "success";
  if (value < 70) return "warning";
  return "danger";
}

export function getActiveBars(level: number, barCount: number): number {
  return Math.ceil((level / 100) * barCount);
}

export function getMeterBarHeight(index: number, barCount: number): number {
  const barNumber = index + 1;
  const wave = Math.sin((barNumber / barCount) * Math.PI);
  return 24 + wave * 64;
}
