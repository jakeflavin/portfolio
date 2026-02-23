import React, { useId, useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Wrapper, Trigger, TriggerLabel, Chevron, Listbox, OptionItem, ErrorMessage } from "./Select.styled";

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
  fullWidth = false,
  id,
  className,
  "aria-label": ariaLabel,
  error
}) => {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const [listboxRect, setListboxRect] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
  } | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder ?? "";

  const close = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    setListboxRect(null);
  };

  const LISTBOX_MAX_HEIGHT = 256; // 16rem
  const LISTBOX_GAP = 4;

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const el = triggerRef.current;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - LISTBOX_GAP;
    const spaceAbove = rect.top - LISTBOX_GAP;
    const openAbove = spaceBelow < Math.min(LISTBOX_MAX_HEIGHT, spaceAbove);

    if (openAbove) {
      setListboxRect({
        bottom: window.innerHeight - rect.top + LISTBOX_GAP,
        left: rect.left,
        width: rect.width
      });
    } else {
      setListboxRect({
        top: rect.bottom + LISTBOX_GAP,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (listboxRef.current?.contains(target)) return;
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
        <Chevron $open={isOpen}>{CHEVRON_SVG}</Chevron>
      </Trigger>
      {error && <ErrorMessage id={`${triggerId}-error`}>{error}</ErrorMessage>}
      {typeof document !== "undefined" && listboxContent
        ? createPortal(listboxContent, document.body)
        : null}
    </Wrapper>
  );
};

export default Select;
