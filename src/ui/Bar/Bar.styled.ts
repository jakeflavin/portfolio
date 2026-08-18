import styled from "styled-components";

interface BarProps {
  align?: "center" | "space-between";
}

export const BarContainer = styled.div<BarProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => align};
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 1000;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    background ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
`;
