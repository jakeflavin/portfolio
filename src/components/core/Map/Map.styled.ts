import styled from "styled-components";

export const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const MapInner = styled.div<{ $interactive: boolean }>`
  width: 100%;
  height: 100%;
  min-height: 300px;
  pointer-events: ${({ $interactive }) => ($interactive ? "auto" : "none")};
`;
