import React from "react";
import { StyledButton } from "./Button.styled";

export interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** When true, the button is disabled and not clickable */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Button type (default: "button") */
  type?: "button" | "submit" | "reset";
  /** Optional class name */
  className?: string;
  /** Accessible label when content is not descriptive enough */
  "aria-label"?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  onClick,
  type = "button",
  className,
  "aria-label": ariaLabel
}) => {
  return (
    <StyledButton
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
