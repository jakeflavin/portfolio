import styled from "styled-components";

interface BarProps {
  align?: "center" | "space-between";
}

/**
 * A flat top row, not a card. Instagram and Threads separate the nav from the feed with a
 * single hairline rather than boxing it in.
 */
export const BarContainer = styled.div<BarProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => align};
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 1000;
  /* Sticky, like Instagram's top bar. Needs an opaque fill so content does not show
     through as it scrolls underneath. */
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;
