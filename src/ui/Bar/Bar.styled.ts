import styled from "styled-components";

interface BarProps {
  align?: "center" | "space-between";
}

export const BarContainer = styled.div<BarProps>`
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => align};
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 1000;
  background: ${({ theme }) => theme.colors.surfaceGlass};
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: box-shadow ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    background ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
`;