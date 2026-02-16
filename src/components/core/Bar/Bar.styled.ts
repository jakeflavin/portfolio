import styled from "styled-components";

interface BarProps {
  align?: "center" | "space-between";
}

export const BarContainer = styled.div<BarProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => align};
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 1000;
  transition: box-shadow 0.2s ease;
`;