import { styled } from "styled-components";

/**
 * Search and sort share one surface, matching the hero's border, radius and elevation.
 * Previously they were two separate pills that happened to sit next to each other.
 */
export const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  /* One row at every width; the sort label is what gives way on narrow screens. */
  flex-direction: row;
  align-items: stretch;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.radii?.lg ?? "16px"};
  box-shadow: ${({ theme }) => theme.shadows.raised ?? "none"};
  transition: border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  /* The children are bare, so focus is shown once, here, for the whole control. */
  &:has(:focus-visible) {
    border-color: ${({ theme }) => theme.colors.focusBorder};
  }

`;

/** An internal rule between the two halves, rather than a gap. */
export const SelectWrap = styled.div`
  align-self: stretch;
  display: flex;
  min-height: 0;
  min-width: 0;
  flex: 0 0 auto;
  border-left: 1px solid ${({ theme }) => theme.colors.divider};

  ${({ theme }) => theme.media.sm} {
    flex: 0 1 12rem;
  }
`;

/**
 * A directory is a finder, so everything stays scannable at once. A single 470px feed
 * column is right for endless browsing and wrong for showing what is available.
 */
export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  text-align: center;
  background: transparent;
`;

export const EmptyTitle = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }) => theme.typography.size?.lg ?? "1rem"};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  letter-spacing: ${({ theme }) => theme.typography.heading.tracking};
  color: ${({ theme }) => theme.colors.text};
`;

export const EmptyHint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  color: ${({ theme }) => theme.colors.muted};
`;
