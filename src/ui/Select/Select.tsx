import React, { useId } from "react";
import { createPortal } from "react-dom";
import { CaretDownIcon } from "@phosphor-icons/react";
import { Wrapper, Trigger, TriggerLabel, Chevron, Listbox, OptionItem, ErrorMessage } from "./Select.styled";
import { getDisplayLabel } from "./select.utils";
import { useSelect } from "./useSelect";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** Selected value (controlled) */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Options to display */
  options: SelectOption[];
  /** Placeholder when nothing selected */
  placeholder?: string;
  /** When true, the select is disabled */
  disabled?: boolean;
  /** When true, the trigger and dropdown take full width of the container */
  fullWidth?: boolean;
  /** Optional id for the trigger (for labels) */
  id?: string;
  /** Optional class name */
  className?: string;
  /** Accessible label */
  "aria-label"?: string;
  /** Error message shown inline below the trigger; also applies error styling */
  error?: string;
}

const Select: React.FC<SelectProps> = ({
  value = "",
  onChange,
  options,
  placeholder,
  disabled = false,
  fullWidth = false,
  id,
  className,
  "aria-label": ariaLabel,
  error
}) => {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const displayLabel = getDisplayLabel(options, value, placeholder);
  const {
    handleListboxKeyDown,
    handleTriggerKeyDown,
    highlightedIndex,
    isOpen,
    listboxRect,
    listboxRef,
    selectOption,
    setHighlightedIndex,
    setIsOpen,
    triggerRef,
    wrapperRef
  } = useSelect({ disabled, onChange, options, value });

  const listboxContent = isOpen && listboxRect && (
    <Listbox
      ref={listboxRef}
      role="listbox"
      tabIndex={-1}
      aria-label={ariaLabel}
      onKeyDown={handleListboxKeyDown}
      $position={listboxRect}
    >
      {options.map((opt, index) => (
        <OptionItem
          key={opt.value}
          role="option"
          id={`select-option-${index}`}
          data-option-index={index}
          $selected={opt.value === value}
          aria-selected={opt.value === value}
          onMouseDown={(e) => {
            e.preventDefault();
            selectOption(opt);
          }}
          onMouseEnter={() => setHighlightedIndex(index)}
        >
          {opt.label}
        </OptionItem>
      ))}
    </Listbox>
  );

  return (
    <Wrapper ref={wrapperRef} className={className} $hasError={!!error} $fullWidth={fullWidth}>
      <Trigger
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-invalid={!!error}
        aria-describedby={error ? `${triggerId}-error` : undefined}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-activedescendant={
          isOpen && highlightedIndex >= 0
            ? `select-option-${highlightedIndex}`
            : undefined
        }
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
      >
        <TriggerLabel>{displayLabel}</TriggerLabel>
        <Chevron $open={isOpen}>
          <CaretDownIcon size={12} aria-hidden="true" />
        </Chevron>
      </Trigger>
      {error && <ErrorMessage id={`${triggerId}-error`}>{error}</ErrorMessage>}
      {typeof document !== "undefined" && listboxContent
        ? createPortal(listboxContent, document.body)
        : null}
    </Wrapper>
  );
};

export default Select;
