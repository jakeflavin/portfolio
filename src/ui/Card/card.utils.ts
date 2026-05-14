import type React from "react";

export function handleKeyboardAction(
  event: React.KeyboardEvent,
  onAction?: () => void
): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onAction?.();
  }
}
