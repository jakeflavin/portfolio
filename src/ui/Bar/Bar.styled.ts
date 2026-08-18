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
  background: transparent;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;
