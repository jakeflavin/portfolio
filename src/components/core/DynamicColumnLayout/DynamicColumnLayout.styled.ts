import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  flex: 1;
  min-height: 0;
`;

export const Column = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ItemWrap = styled.div``;
