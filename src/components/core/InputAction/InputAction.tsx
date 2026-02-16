import React from "react";
import { Wrapper, Input, LeftIconSlot } from "./InputAction.styled";
import IconButton from "../IconButton";
import XmarkIcon from "@/assets/icons/circle-xmark.svg?react";

export interface InputActionProps {
  /** SVG element to render on the left (e.g. search icon) */
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  /** Controlled value */
  value?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Placeholder / initial hint text when empty */
  placeholder?: string;
  /** Click handler for the primary action button (right). If not provided, a clear button is shown when value is non-empty. */
  onAction?: () => void;
  /** Accessible label for the primary action button */
  actionAriaLabel?: string;
  /** Icon size in pixels */
  iconSize?: number;
}

const InputAction: React.FC<InputActionProps> = ({
  icon,
  value = "",
  onChange,
  placeholder,
  onAction,
  actionAriaLabel,
  iconSize = 16
}) => {
  const styledLeftIcon = React.cloneElement(icon, {
    width: iconSize,
    height: iconSize,
    fill: "currentColor",
    display: "block"
  });

  const handleClear = () => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: "" }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const showClear = value.length > 0 && !!onChange;

  return (
    <Wrapper>
      <LeftIconSlot aria-hidden="true">{styledLeftIcon}</LeftIconSlot>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {showClear ? (
        <IconButton
          icon={<XmarkIcon />}
          size={iconSize}
          variant="default"
          onClick={handleClear}
          ariaLabel="Clear input"
        />
      ) : onAction ? (
        <IconButton
          icon={icon}
          size={iconSize}
          variant="default"
          onClick={onAction}
          ariaLabel={actionAriaLabel}
        />
      ) : null}
    </Wrapper>
  );
};

export default InputAction;
