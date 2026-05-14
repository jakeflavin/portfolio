import styled from "styled-components";

export type SurfacePadding = "sm" | "md" | "lg";
export type SurfaceVariant = "secondary" | "surface" | "paper";
export type SurfaceShadow = "sm" | "md" | "mdDown";

export interface SurfaceStyledProps {
  $padding?: SurfacePadding;
  $variant?: SurfaceVariant;
  $shadow?: SurfaceShadow;
  $interactive?: boolean;
}

const glassVariantKey = (v: SurfaceVariant) =>
  v === "surface" ? "surfaceGlass" : v === "paper" ? "paper" : "secondaryGlass";

export const StyledSurface = styled.div<SurfaceStyledProps>`
  padding: ${({ $padding = "md", theme }) =>
    $padding === "sm"
      ? `${theme.spacing.sm} ${theme.spacing.xs}`
      : theme.spacing[$padding]};
  background-color: ${({ $variant = "secondary", theme }) =>
    theme.colors[glassVariantKey($variant)] ?? theme.colors[$variant]};
  backdrop-filter: blur(${({ theme }) => theme.blur?.md ?? "16px"});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur?.md ?? "16px"});
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ $shadow = "mdDown", theme }) => theme.shadows[$shadow]};
  transition: box-shadow ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    transform ${({ theme }) => theme.motion?.duration?.fast ?? "0.2s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
  ${({ $interactive, theme }) =>
    $interactive &&
    `
    &:hover {
      box-shadow: ${theme.shadows.md};
    }
  `}
`;
