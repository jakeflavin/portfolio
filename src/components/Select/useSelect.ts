import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SelectOption } from "./Select";
import {
  getNextIndex,
  getPreviousIndex,
  getSelectedOptionIndex,
  LISTBOX_GAP,
  LISTBOX_MAX_HEIGHT
} from "./select.utils";

interface ListboxPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
}

interface UseSelectOptions {
  disabled: boolean;
  onChange?: (value: string) => void;
  options: SelectOption[];
  value: string;
}

export function useSelect({ disabled, onChange, options, value }: UseSelectOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [listboxRect, setListboxRect] = useState<ListboxPosition | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const close = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    setListboxRect(null);
  };

  const openAtIndex = (index: number) => {
    setIsOpen(true);
    setHighlightedIndex(index);
  };

  const selectOption = (option: SelectOption) => {
    onChange?.(option.value);
    close();
  };

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - LISTBOX_GAP;
    const spaceAbove = rect.top - LISTBOX_GAP;
    const openAbove = spaceBelow < Math.min(LISTBOX_MAX_HEIGHT, spaceAbove);

    setListboxRect(
      openAbove
        ? {
            bottom: window.innerHeight - rect.top + LISTBOX_GAP,
            left: rect.left,
            width: rect.width
          }
        : {
            top: rect.bottom + LISTBOX_GAP,
            left: rect.left,
            width: rect.width
          }
    );
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (listboxRef.current?.contains(target)) return;
      close();
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
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

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (disabled) return;

      if (isOpen && highlightedIndex >= 0 && options[highlightedIndex]) {
        selectOption(options[highlightedIndex]);
      } else {
        setIsOpen((prev) => !prev);
        if (!isOpen) setHighlightedIndex(getSelectedOptionIndex(options, value));
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        openAtIndex(0);
      } else {
        setHighlightedIndex((index) => getNextIndex(index, options.length));
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        openAtIndex(options.length - 1);
      } else {
        setHighlightedIndex(getPreviousIndex);
      }
    }
  };

  const handleListboxKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) => getNextIndex(index, options.length));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex(getPreviousIndex);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (highlightedIndex >= 0 && options[highlightedIndex]) {
        selectOption(options[highlightedIndex]);
      }
    }
  };

  return {
    close,
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
  };
}
