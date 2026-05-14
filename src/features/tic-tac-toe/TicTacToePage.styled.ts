import styled from "styled-components";
import Surface from "@/ui/Surface";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;

  ${({ theme }) => theme.media.md} {
    grid-template-columns: minmax(0, 280px) 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

export const ActionsPanel = styled(Surface)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const RightColumn = styled.div`
  display: flex;
  align-items: stretch;
  min-width: 0;
  width: 100%;
`;

export const BoardSurface = styled(Surface)`
  flex: 1;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;
