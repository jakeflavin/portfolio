import { styled } from 'styled-components'

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
  /* Filled rather than outlined: with the surfaces and hairlines gone this is the only
     thing marking the control out from the page. */
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.radii?.sm ?? '8px'};
  transition: border-color ${({ theme }) => theme.motion?.duration?.normal ?? '0.15s'}
    ${({ theme }) => theme.motion?.easing ?? 'ease'};

  /* The children are bare, so focus is shown once, here, for the whole control. */
  &:has(:focus-visible) {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`

/** An internal rule between the two halves, rather than a gap. */
export const SelectWrap = styled.div`
  align-self: stretch;
  display: flex;
  min-height: 0;
  min-width: 0;
  /*
   * Shrinks rather than pushing the row past the viewport. The rule above says the sort
   * label is what gives way on a narrow screen, but a flex of 0 0 auto never let it: at 390px the
   * control kept its full width and the whole page scrolled sideways by 11px.
   */
  flex: 0 1 auto;
  /* Its own colour, since the divider token is switched off. The rule faces the field,
     so it moved with the control when sort went to the left of the row. */
  border-right: 1px solid ${({ theme }) => theme.colors.border};

  ${({ theme }) => theme.media.sm} {
    flex: 0 1 12rem;
  }
`

/**
 * A directory is a finder, so everything stays scannable at once. A single 470px feed
 * column is right for endless browsing and wrong for showing what is available.
 */
/**
 * Explicit column counts rather than auto-fill. A minmax of 300px meant three columns only
 * appeared past a ~930px container, so a browser at 830px still showed two — the breakpoint
 * was an accident of the arithmetic rather than a decision.
 */
/**
 * One column, at every width.
 *
 * It is the feed, and a feed is a column: two and three across turned it into a directory
 * of thumbnails, which is what the grid beside it is already for. The measure the cards
 * sit in comes from the app's own width rather than from a column count here.
 */
export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  text-align: center;
  background: transparent;
`

export const EmptyTitle = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }) => theme.typography.size?.lg ?? '1rem'};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  letter-spacing: ${({ theme }) => theme.typography.heading.tracking};
  color: ${({ theme }) => theme.colors.text};
`

export const EmptyHint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};
  color: ${({ theme }) => theme.colors.muted};
`

/**
 * Wraps whichever layout is showing, so keyboard navigation has one element to search for
 * focusable results inside regardless of view.
 */
export const Results = styled.div`
  width: 100%;
`
