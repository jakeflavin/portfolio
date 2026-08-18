import styled from "styled-components";

interface CardWrapperProps {
  $disabled?: boolean;
}

/**
 * Borderless, like a tile in an Instagram profile grid: the media carries the card and the
 * text sits directly beneath it on the page background. No box, no shadow, no lift.
 */
export const CardWrapper = styled.a<CardWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  gap: ${({ theme }) => theme.spacing.sm};
  background: transparent;
  border-radius: ${({ theme }) => theme.radii?.sm ?? "8px"};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 4px;
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    cursor: default;
    opacity: 0.4;
  `}
`;

export const ImageContainer = styled.div`
  width: 100%;
  /* Matches the 960x540 cover art, so nothing gets cropped. */
  aspect-ratio: 16 / 9;
  border-radius: ${({ theme }) => theme.radii?.md ?? "12px"};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.secondary};
  position: relative;

  /* Instagram dims the tile on hover rather than moving it. */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: #000000;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
  }

  ${CardWrapper}:hover &::after {
    opacity: 0.06;
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: ${({ theme }) => theme.img.brightness};
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CardTypeLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.size?.xs ?? "0.75rem"};
  color: ${({ theme }) => theme.colors.muted};
  font-weight: ${({ theme }) => theme.typography.weight?.normal ?? 400};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.card?.titleSize ?? "0.9375rem"};
  line-height: 1.35;
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  letter-spacing: ${({ theme }) => theme.typography.card?.titleTracking ?? "-0.01em"};
  text-transform: ${({ theme }) => theme.typography.card?.titleTransform ?? "none"};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.muted};
  text-wrap: pretty;
`;

export const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.size?.sm ?? "0.8125rem"};
  font-weight: ${({ theme }) => theme.typography.weight?.medium ?? 500};
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.secondary};
  border: none;
  border-radius: ${({ theme }) => theme.radii?.sm ?? "8px"};
  padding: 3px 8px;
`;
