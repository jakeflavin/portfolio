import styled from "styled-components";
import Surface from "@/ui/Surface";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  max-width: 100%;
`;

export const StatusBox = styled(Surface)<{ $error?: boolean }>`
  color: ${({ theme, $error }) => ($error ? theme.colors.muted : theme.colors.text)};
  font-size: 0.9375rem;
  text-align: center;
`;

export const WeatherGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: dense;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const WeatherCard = styled(Surface)<{ $span?: "wide" | "tall" | "hero" }>`
  min-height: ${({ $span }) => ($span === "hero" ? "280px" : $span === "tall" ? "260px" : "160px")};
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  overflow: hidden;

  ${({ theme, $span }) =>
    ($span === "wide" || $span === "hero") &&
    `
    ${theme.media.md} {
      grid-column: span 2;
    }
  `}
`;

export const HeroWeatherCard = styled(WeatherCard)`
  justify-content: space-between;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 0;
`;

export const CenterBody = styled(CardBody)`
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
`;

export const HeroTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const HeroTemp = styled.div`
  font-size: clamp(4rem, 12vw, 7rem);
  font-weight: 700;
  line-height: 0.9;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: ${({ theme }) => theme.typography.heading.tracking};
`;

export const HeroSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9375rem;
`;

export const CardIconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  line-height: 0;

  svg {
    flex-shrink: 0;
    fill: currentColor;
    stroke: currentColor;
  }
`;

export const TempRow = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.1;
`;

export const BigValue = styled.span<{ $highlight?: boolean }>`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: ${({ theme }) => theme.typography.heading.tracking};
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.primary : theme.colors.text};
`;

export const Muted = styled.span`
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.muted};
`;

export const LocationText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const ChartFrame = styled.div`
  width: 100%;
  height: 180px;
  min-height: 0;
`;

export const HourlyScroller = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  scrollbar-width: thin;
`;

export const HourlyItem = styled.div`
  flex: 0 0 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const ForecastList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ForecastRow = styled.div`
  display: grid;
  grid-template-columns: 4.5rem 2rem minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9375rem;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const RangeBar = styled.div`
  height: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.secondaryGlass};
  overflow: hidden;
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.border};
`;

export const RangeFill = styled.div<{ $start: number; $width: number }>`
  height: 100%;
  margin-left: ${({ $start }) => $start}%;
  width: ${({ $width }) => $width}%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.primary};
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const MetricPill = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.surface};
  min-width: 0;
`;

export const SunRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};

  svg {
    flex-shrink: 0;
    fill: currentColor;
    stroke: currentColor;
  }

  strong {
    font-size: 1.125rem;
    font-weight: 700;
  }
`;
