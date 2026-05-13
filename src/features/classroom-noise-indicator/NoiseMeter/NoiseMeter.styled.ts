import styled from "styled-components";
import { StyledSurface } from "@/ui/Surface";

export const MeterSurface = styled(StyledSurface).attrs({
  $padding: "lg",
  $variant: "surface",
  $shadow: "md"
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Face = styled.div<{ $level: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 10rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.48), transparent 32%),
    ${({ $level }) =>
      $level < 45
        ? "linear-gradient(135deg, #dff5d8, #9edfa4)"
        : $level < 70
          ? "linear-gradient(135deg, #fff2b8, #f6c760)"
          : "linear-gradient(135deg, #ffd1c2, #ef6b54)"};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
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

export const MeterBar = styled.div<{ $active: boolean; $height: number; $color: string }>`
  height: ${({ $height }) => `${$height}%`};
  min-height: 12px;
  border-radius: 999px 999px ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xs};
  background: ${({ $active, $color, theme }) =>
    $active ? $color : theme.colors.border};
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

export const LevelBadge = styled.span<{ $level: number }>`
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 999px;
  background: ${({ $level }) =>
    $level < 45 ? "#2f7d3b" : $level < 70 ? "#9a6a00" : "#a73525"};
  color: #ffffff;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
`;
