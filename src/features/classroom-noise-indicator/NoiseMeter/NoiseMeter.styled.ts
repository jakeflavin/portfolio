import styled from "styled-components";
import Surface from "@/ui/Surface";

export type NoiseTone = "success" | "warning" | "danger";

const toneColor = (tone: NoiseTone, theme: import("styled-components").DefaultTheme) =>
  tone === "success" ? theme.colors.success : tone === "warning" ? theme.colors.warning : theme.colors.danger;

export const MeterSurface = styled(Surface)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Face = styled.div<{ $tone: NoiseTone }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 10rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(
      circle at 50% 35%,
      color-mix(in srgb, ${({ theme }) => theme.colors.surface} 52%, transparent),
      transparent 32%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, ${({ $tone, theme }) => toneColor($tone, theme)} 22%, ${({ theme }) => theme.colors.surface}),
      color-mix(in srgb, ${({ $tone, theme }) => toneColor($tone, theme)} 58%, ${({ theme }) => theme.colors.surface})
    );
  box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.border};
  font-size: clamp(4.5rem, 14vw, 8rem);
  line-height: 1;
`;

export const MeterTrack = styled.div`
  display: grid;
  grid-template-columns: repeat(24, minmax(0, 1fr));
  align-items: end;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 9rem;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.secondaryGlass ?? theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const MeterBar = styled.div<{ $active: boolean; $height: number; $tone: NoiseTone }>`
  height: ${({ $height }) => `${$height}%`};
  min-height: 12px;
  border-radius: 999px 999px ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xs};
  background: ${({ $active, $tone, theme }) =>
    $active ? toneColor($tone, theme) : theme.colors.border};
  opacity: ${({ $active }) => ($active ? 1 : 0.35)};
  transition:
    height ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing},
    background ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing},
    opacity ${({ theme }) => theme.motion.duration.fast} ${({ theme }) => theme.motion.easing};
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const StatusText = styled.div`
  min-width: 0;

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-size: 1.25rem;
    line-height: 1.2;
  }

  span {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.875rem;
    line-height: 1.4;
  }
`;

export const LevelBadge = styled.span<{ $tone: NoiseTone }>`
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 999px;
  background: ${({ $tone, theme }) => toneColor($tone, theme)};
  color: ${({ theme }) => theme.colors.inverseText};
  font-weight: 800;
  font-variant-numeric: tabular-nums;
`;
