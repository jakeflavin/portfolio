import styled from "styled-components";

/** Instagram's grid runs three across with hairline gaps and no rounding. */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;

  ${({ theme }) => theme.media.sm} {
    gap: 4px;
  }
`;

export const Tile = styled.a<{ $disabled?: boolean; $featured?: boolean }>`
  position: relative;
  display: block;
  aspect-ratio: 1 / 1;

  /* Explore breaks its rhythm with an occasional double-height tile. */
  ${({ $featured }) =>
    $featured &&
    `
    grid-column: span 2;
    grid-row: span 2;
    aspect-ratio: 1 / 1;
  `}
  overflow: hidden;
  background: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: -2px;
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    cursor: default;
    opacity: 0.45;
  `}
`;

export const TileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: ${({ theme }) => theme.img.brightness};
`;

/**
 * Instagram reveals a post's counts on hover behind a dark scrim. A directory has no
 * counts, so the title and tags take that slot.
 */
export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  ${Tile}:hover &,
  ${Tile}:focus-visible & {
    opacity: 1;
  }
`;

export const OverlayTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  line-height: 1.3;
`;

export const OverlayMeta = styled.span`
  font-size: ${({ theme }) => theme.typography.size?.xs ?? "0.75rem"};
  opacity: 0.85;
`;

/** Instagram marks a multi-image post with a corner glyph; this marks a live app. */
export const TileBadge = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  display: inline-flex;
  line-height: 0;
  color: #ffffff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45));

  ${Tile}:hover & {
    opacity: 0;
  }
`;
