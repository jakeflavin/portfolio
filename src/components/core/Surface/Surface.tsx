import React from "react";
import { StyledSurface } from "./Surface.styled";
import type { SurfacePadding, SurfaceVariant, SurfaceShadow } from "./Surface.styled";

export interface SurfaceProps {
  children?: React.ReactNode;
  /** Padding size (default: md) */
  padding?: SurfacePadding;
  /** Background variant: secondary (default) or surface */
  variant?: SurfaceVariant;
  /** Shadow style: mdDown (default), md, or sm */
  shadow?: SurfaceShadow;
  /** Optional class name */
  className?: string;
  /** Render as a different element (e.g. "section", "article") */
  as?: React.ElementType;
  /** When true, adds hover styles (stronger shadow and border) */
  interactive?: boolean;
}

const Surface: React.FC<SurfaceProps> = ({
  children,
  padding = "md",
  variant = "secondary",
  shadow = "mdDown",
  className,
  as,
  interactive
}) => {
  return (
    <StyledSurface
      className={className}
      as={as}
      $padding={padding}
      $variant={variant}
      $shadow={shadow}
      $interactive={interactive}
    >
      {children}
    </StyledSurface>
  );
};

export default Surface;
