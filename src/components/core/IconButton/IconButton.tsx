import React from "react";
import { Button } from "./IconButton.styled";

interface IconButtonProps {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  /** Icon shown when active (e.g. filled variant). If not provided, icon is unchanged when active. */
  activeIcon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  /** Whether the button is in the active state */
  active?: boolean;
  /** Override icon color (default: uses variant – bar uses inverseText, default uses primary) */
  color?: string;
  size?: number;
  onClick?: () => void;
  ariaLabel?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  activeIcon,
  active = false,
  color,
  size = 24,
  onClick,
  ariaLabel
}) => {
  const sourceIcon = active && activeIcon ? activeIcon : icon;
  const styledIcon = React.cloneElement(sourceIcon, {
    width: size,
    height: size,
    fill: color ?? "currentColor",
    display: "block"
  });

  return (
    <Button onClick={onClick} aria-label={ariaLabel}>
      {styledIcon}
    </Button>
  );
};

export default IconButton;