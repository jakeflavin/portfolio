import React from "react";
import { Wrapper, Input, ActionButton } from "./InputAction.styled";

export interface InputActionProps {
  /** SVG element to render inside the action button */
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  /** Controlled value */
  value?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Placeholder / initial hint text when empty */
  placeholder?: string;
  /** Click handler for the action button */
  onAction?: () => void;
  /** Accessible label for the action button */
  actionAriaLabel?: string;
  /** Icon size in pixels */
  iconSize?: number;
}

const InputAction: React.FC<InputActionProps> = ({
  icon,
  value,
  onChange,
  placeholder,
  onAction,
  actionAriaLabel,
  iconSize = 24
}) => {
  const styledIcon = React.cloneElement(icon, {
    width: iconSize,
    height: iconSize,
    fill: "currentColor",
    display: "block"
  });

  return (
    <Wrapper>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <ActionButton
        type="button"
        onClick={onAction}
        aria-label={actionAriaLabel}
      >
        {styledIcon}
      </ActionButton>
    </Wrapper>
  );
};

export default InputAction;
