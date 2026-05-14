import { styled } from "styled-components";
import Surface from "@/ui/Surface";

export const AddRow = styled(Surface)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const AddActionsRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const AddButtonWrap = styled.div`
  flex: 1;
  min-width: 0;

  & > button {
    width: 100%;
  }
`;

export const AddError = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.muted};
`;

export const SelectWrap = styled.div`
  display: flex;
  align-self: stretch;
  min-height: 0;
`;

export const MetaContainer = styled.div`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;
