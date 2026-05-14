import React from "react";
import { StyledSurface } from "./Surface.styled";
import type { SurfacePadding, SurfaceVariant, SurfaceShadow } from "./Surface.styled";

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** Padding size (default: md) */
  padding?: SurfacePadding;
  /** Background variant: secondary (default), surface, or paper */
  variant?: SurfaceVariant;
  /** Shadow style: mdDown (default), md, or sm */
  shadow?: SurfaceShadow;
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
  as,
  interactive,
  ...rest
}) => {
  return (
    <StyledSurface
      as={as}
      $padding={padding}
      $variant={variant}
      $shadow={shadow}
      $interactive={interactive}
      {...rest}
    >
      {children}
    </StyledSurface>
  );
};

export default Surface;
