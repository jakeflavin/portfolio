import React, { useId } from "react";
import { Wrapper, HiddenInput, Track, Thumb, LabelText } from "./Toggle.styled";

export interface ToggleProps {
  /** Whether the toggle is on (checked). */
  checked: boolean;
  /** Called when the user toggles; receives the new checked state. */
  onChange: (checked: boolean) => void;
  /** Optional label shown next to the switch. */
  label?: string;
  /** When true, the toggle is disabled and not clickable. */
  disabled?: boolean;
  /** Optional class name for the wrapper. */
  className?: string;
  /** Accessible name when label is not provided. */
  "aria-label"?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
  "aria-label": ariaLabel
}) => {
  const id = useId();
  const labelId = label ? `${id}-label` : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) onChange(e.target.checked);
  };

  return (
    <Wrapper
      className={className}
      htmlFor={id}
      $disabled={disabled}
      data-disabled={disabled || undefined}
      aria-label={!label ? ariaLabel : undefined}
    >
      <HiddenInput
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        aria-checked={checked}
        aria-label={!label ? ariaLabel : undefined}
        aria-labelledby={labelId}
      />
       {label && (
        <LabelText id={labelId}>
          {label}
        </LabelText>
      )}
      <Track $checked={checked} aria-hidden="true">
        <Thumb $checked={checked} />
      </Track>
    </Wrapper>
  );
};

export default Toggle;
