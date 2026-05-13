import React, { useId } from "react";
import { Outer, Label, Wrapper, Input, LeftIconSlot, ErrorMessage } from "./InputAction.styled";
import IconButton from "../IconButton";
import XmarkIcon from "@/assets/icons/circle-xmark.svg?react";

export interface InputActionProps {
  /** SVG element to render on the left (e.g. search icon) */
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  /** Optional label shown above the input */
  label?: string;
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
  /** When true, input is read-only and visually clearly disabled */
  disabled?: boolean;
  /** Error message shown inline below the input; also applies error styling */
  error?: string;
}

const InputAction: React.FC<InputActionProps> = ({
  icon,
  label,
  value = "",
  onChange,
  placeholder,
  onAction,
  actionAriaLabel,
  iconSize = 16,
  disabled = false,
  error
}) => {
  const inputId = useId();
  const styledLeftIcon = icon ? React.cloneElement(icon, {
    width: iconSize,
    height: iconSize,
    fill: "currentColor",
    display: "block"
  }) : null;

  const handleClear = () => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: "" }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const showClear = value.length > 0 && !!onChange;

  const content = (
    <Wrapper $disabled={disabled} $hasLabel={!!label} $hasError={!!error}>
      {label && (
        <Label htmlFor={inputId}>{label}</Label>
      )}
      <LeftIconSlot aria-hidden="true">{styledLeftIcon}</LeftIconSlot>
      <Input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        disabled={disabled}
      />
      {showClear && !disabled ? (
        <IconButton
          icon={<XmarkIcon />}
          size={iconSize}
          onClick={handleClear}
          ariaLabel="Clear input"
        />
      ) : onAction && icon ? (
        <IconButton
          icon={icon}
          size={iconSize}
          onClick={onAction}
          ariaLabel={actionAriaLabel}
        />
      ) : null}
    </Wrapper>
  );

  return (
    <Outer>
      {content}
      {error && <ErrorMessage id={inputId ? `${inputId}-error` : undefined}>{error}</ErrorMessage>}
    </Outer>
  );
};

export default InputAction;
