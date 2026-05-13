import React from "react";
import {
  Face,
  LevelBadge,
  MeterBar,
  MeterSurface,
  MeterTrack,
  StatusRow,
  StatusText
} from "./NoiseMeter.styled";

export interface NoiseMeterProps {
  level: number;
  isListening: boolean;
}

function clampLevel(level: number): number {
  return Math.max(0, Math.min(100, Math.round(level)));
}

function getMeterState(level: number, isListening: boolean) {
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

function getBarColor(index: number): string {
  if (index < 10) return "#41a857";
  if (index < 17) return "#f2bd35";
  return "#e45d4c";
}

const NoiseMeter: React.FC<NoiseMeterProps> = ({ level, isListening }) => {
  const safeLevel = clampLevel(level);
  const activeBars = Math.ceil((safeLevel / 100) * 24);
  const state = getMeterState(safeLevel, isListening);

  return (
    <MeterSurface>
      <Face $level={safeLevel} aria-label={state.title}>
        {state.emoji}
      </Face>
      <MeterTrack aria-label={`Noise level ${safeLevel}%`}>
        {Array.from({ length: 24 }, (_, index) => {
          const barNumber = index + 1;
          const wave = Math.sin((barNumber / 24) * Math.PI);
          const height = 24 + wave * 64;

          return (
            <MeterBar
              key={barNumber}
              $active={barNumber <= activeBars && isListening}
              $height={height}
              $color={getBarColor(index)}
            />
          );
        })}
      </MeterTrack>
      <StatusRow>
        <StatusText>
          <strong>{state.title}</strong>
          <span>{state.description}</span>
        </StatusText>
        <LevelBadge $level={safeLevel}>{safeLevel}%</LevelBadge>
      </StatusRow>
    </MeterSurface>
  );
};

export default NoiseMeter;
