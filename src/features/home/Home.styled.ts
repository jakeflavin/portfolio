import { styled } from "styled-components";

export const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: row;
  align-items: stretch;
`;

export const SelectWrap = styled.div`
  align-self: stretch;
  display: flex;
  min-height: 0;
  min-width: 0;
  flex: 0 1 12rem;
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
