import styled from "styled-components";

export const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-variant-numeric: tabular-nums;
`;

export const Segment = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5em;
`;

export const AnimatedValue = styled.span`
  display: inline-block;
  font-size: 2rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
  animation: tick 0.35s ease-out;

  @keyframes tick {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    40% {
      transform: translateY(-6px) scale(1.05);
      opacity: 0.7;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

export const Separator = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  user-select: none;
`;
