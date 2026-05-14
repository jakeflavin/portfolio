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
import {
  clampLevel,
  getActiveBars,
  getMeterBarHeight,
  getMeterState,
  getNoiseTone
} from "./noiseMeter.utils";

export interface NoiseMeterProps {
  level: number;
  isListening: boolean;
}

const BAR_COUNT = 24;

const NoiseMeter: React.FC<NoiseMeterProps> = ({ level, isListening }) => {
  const safeLevel = clampLevel(level);
  const activeBars = getActiveBars(safeLevel, BAR_COUNT);
  const state = getMeterState(safeLevel, isListening);
  const tone = getNoiseTone(safeLevel);

  return (
    <MeterSurface padding="lg" variant="surface" shadow="md">
      <Face $tone={tone} aria-label={state.title}>
        {state.emoji}
      </Face>
      <MeterTrack aria-label={`Noise level ${safeLevel}%`}>
        {Array.from({ length: BAR_COUNT }, (_, index) => {
          const barNumber = index + 1;

          return (
            <MeterBar
              key={barNumber}
              $active={barNumber <= activeBars && isListening}
              $height={getMeterBarHeight(index, BAR_COUNT)}
              $tone={getNoiseTone((index / 23) * 100)}
            />
          );
        })}
      </MeterTrack>
      <StatusRow>
        <StatusText>
          <strong>{state.title}</strong>
          <span>{state.description}</span>
        </StatusText>
        <LevelBadge $tone={tone}>{safeLevel}%</LevelBadge>
      </StatusRow>
    </MeterSurface>
  );
};

export default NoiseMeter;
