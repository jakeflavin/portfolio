import { styled } from "styled-components";

export const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  /* Stacked on phones — side by side the sort control gets squeezed to an ellipsis. */
  flex-direction: column;
  align-items: stretch;

  ${({ theme }) => theme.media.sm} {
    flex-direction: row;
  }
`;

export const SelectWrap = styled.div`
  align-self: stretch;
  display: flex;
  min-height: 0;
  min-width: 0;

  ${({ theme }) => theme.media.sm} {
    flex: 0 1 12rem;
  }
`;

/** One column, as a feed is. Density lives in the grid view instead. */
export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
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
