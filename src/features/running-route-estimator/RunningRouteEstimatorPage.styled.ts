import styled from "styled-components";
import Surface from "@/ui/Surface";

export const ButtonBlock = styled(Surface)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: stretch;
`;

export const TotalMilesBlock = styled(Surface)`
  width: 100%;
`;

export const TotalMilesLabel = styled.div`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
`;

export const TotalMilesValue = styled.div`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const MapWrapper = styled.div`
  min-height: 300px;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    grid-template-columns: 1fr 2fr;
  }
`;
