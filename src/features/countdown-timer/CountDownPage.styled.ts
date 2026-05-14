import styled from "styled-components";
import Surface from "@/ui/Surface";

export const FormContainer = styled(Surface)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ActionContainer = styled(Surface)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

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

export const RightColumn = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const TimerSurface = styled(Surface)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
