import styled from "styled-components";

interface BarProps {
  align?: "center" | "space-between";
}

/**
 * Sits on the page with no fill and no rule.
 *
 * That rules out making it sticky: with nothing behind it, content scrolls through the
 * bar rather than under it. It scrolls away with the page instead.
 */
export const BarContainer = styled.div<BarProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => align};
  gap: ${({ theme }) => theme.spacing.md};
  background: transparent;
`;
