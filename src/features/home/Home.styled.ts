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

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.media.md} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  text-align: center;
  background-color: ${({ theme }) => theme.colors.secondaryGlass ?? theme.colors.secondary};
  backdrop-filter: blur(${({ theme }) => theme.blur?.md ?? "16px"});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur?.md ?? "16px"});
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

export const EmptyTitle = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }) => theme.typography.size?.lg ?? "1rem"};
  text-transform: ${({ theme }) => theme.typography.heading.transform};
  letter-spacing: ${({ theme }) => theme.typography.heading.tracking};
  color: ${({ theme }) => theme.colors.text};
`;

export const EmptyHint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  color: ${({ theme }) => theme.colors.muted};
`;
