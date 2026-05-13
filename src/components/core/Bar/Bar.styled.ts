import styled from "styled-components";

interface BarProps {
  align?: "center" | "space-between";
}

export const BarContainer = styled.div<BarProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xs};

  display: flex;
  align-items: center;
  justify-content: ${({ align }) => align};
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 1000;
  transition: box-shadow ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
`;