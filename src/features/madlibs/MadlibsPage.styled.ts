import styled from "styled-components";
import Surface from "@/ui/Surface";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;

  ${({ theme }) => theme.media.md} {
    grid-template-columns: minmax(0, 320px) 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

export const FormPanel = styled(Surface)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const FormFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SelectWrap = styled.div`
  width: 100%;
  min-width: 0;
  flex: 1;
`;

export const ButtonWrap = styled.div`
  width: 100%;
  min-width: 0;
  flex: 1;
  display: flex;

  & > button {
    flex: 1;
    width: 100%;
  }
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 200px;
`;

export const StoryBox = styled(Surface)`
  flex: 1;
  width: 100%;
  font-size: 1rem;
  line-height: 1.6;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
`;
