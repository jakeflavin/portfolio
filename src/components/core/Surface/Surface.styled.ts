import styled from "styled-components";

export type SurfacePadding = "sm" | "md" | "lg";
export type SurfaceVariant = "secondary" | "surface";
export type SurfaceShadow = "sm" | "md" | "mdDown";

export interface SurfaceStyledProps {
  $padding?: SurfacePadding;
  $variant?: SurfaceVariant;
  $shadow?: SurfaceShadow;
  $interactive?: boolean;
}

export const StyledSurface = styled.div<SurfaceStyledProps>`
  padding: ${({ $padding = "md", theme }) =>
    $padding === "sm"
      ? `${theme.spacing.sm} ${theme.spacing.xs}`
      : theme.spacing[$padding]};
  background-color: ${({ $variant = "secondary", theme }) => theme.colors[$variant]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ $shadow = "mdDown", theme }) => theme.shadows[$shadow]};
  ${({ $interactive, theme }) =>
    $interactive &&
    `
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
    &:hover {
      box-shadow: ${theme.shadows.md};
      border-color: ${theme.colors.muted};
    }
  `}
`;
