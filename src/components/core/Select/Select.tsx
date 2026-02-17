import React, { useState, useRef, useEffect } from "react";
import { Wrapper, Trigger, TriggerLabel, Chevron, Listbox, OptionItem } from "./Select.styled";

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
  /** Optional id for the trigger (for labels) */
  id?: string;
  /** Optional class name */
  className?: string;
  /** Accessible label */
  "aria-label"?: string;
}

const CHEVRON_SVG = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden
  >
    <path d="M2 4l4 4 4-4" />
  </svg>
);

const Select: React.FC<SelectProps> = ({
  value = "",
  onChange,
  options,
  placeholder,
  disabled = false,
  id,
  className,
  "aria-label": ariaLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder ?? "";

  const close = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current?.contains(e.target as Node)) return;
      close();
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    listboxRef.current
      ?.querySelector(`[data-option-index="${highlightedIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [isOpen, highlightedIndex]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (disabled) return;
      if (isOpen && highlightedIndex >= 0 && options[highlightedIndex]) {
        onChange?.(options[highlightedIndex].value);
        close();
      } else {
        setIsOpen((prev) => !prev);
        if (!isOpen)
          setHighlightedIndex(
            value ? Math.max(0, options.findIndex((o) => o.value === value)) : 0
          );
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((i) =>
          i < options.length - 1 ? i + 1 : i
        );
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(options.length - 1);
      } else {
        setHighlightedIndex((i) => (i > 0 ? i - 1 : 0));
      }
      return;
    }
  };

  const handleListboxKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) =>
        i < options.length - 1 ? i + 1 : i
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : 0));
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlightedIndex >= 0 && options[highlightedIndex]) {
        onChange?.(options[highlightedIndex].value);
        close();
      }
      return;
    }
  };

  const selectOption = (opt: SelectOption) => {
    onChange?.(opt.value);
    close();
  };

  return (
    <Wrapper ref={wrapperRef} className={className}>
      <Trigger
        id={id}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-label={ariaLabel}
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
        <Chevron $open={isOpen}>{CHEVRON_SVG}</Chevron>
      </Trigger>
      {isOpen && (
        <Listbox
          ref={listboxRef}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          onKeyDown={handleListboxKeyDown}
        >
          {options.map((opt, index) => (
            <OptionItem
              key={opt.value}
              role="option"
              id={`select-option-${index}`}
              data-option-index={index}
              $selected={opt.value === value}
              aria-selected={opt.value === value}
              onClick={() => selectOption(opt)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {opt.label}
            </OptionItem>
          ))}
        </Listbox>
      )}
    </Wrapper>
  );
};

export default Select;
