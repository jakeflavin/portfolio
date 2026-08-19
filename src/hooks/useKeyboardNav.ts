import { useCallback, useEffect, useRef } from "react";

/** Marks the element in each result that keyboard navigation should land on. */
export const NAV_ITEM_ATTRIBUTE = "data-nav-item";

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
};

export interface KeyboardNavOptions {
  /** Focused by `/`, and cleared and blurred by Escape. */
  searchRef: React.RefObject<HTMLInputElement | null>;
  /** The element results are rendered inside. */
  resultsRef: React.RefObject<HTMLElement | null>;
  /** Called when Escape clears an active search. */
  onClearSearch: () => void;
  /** Whether a search is currently narrowing the list. */
  hasSearch: boolean;
}

/**
 * Keyboard navigation for the directory.
 *
 * `/` focuses the search, j and k walk the results, Escape clears. It is the convention a
 * directory of developer tools should follow, and it is also the only way to move through
 * the grid without a mouse: the results are links, so the browser's own tab order runs
 * through every action inside a card before reaching the next one.
 *
 * Movement works off whatever is in the DOM rather than an index into the data, so the
 * same handler serves all three layouts without knowing which one is showing.
 */
export function useKeyboardNav({
  searchRef,
  resultsRef,
  onClearSearch,
  hasSearch
}: KeyboardNavOptions) {
  // Kept in a ref so the listener is bound once rather than rebound on every keystroke.
  const stateRef = useRef({ onClearSearch, hasSearch });

  useEffect(() => {
    stateRef.current = { onClearSearch, hasSearch };
  }, [onClearSearch, hasSearch]);

  const items = useCallback(
    () =>
      Array.from(
        resultsRef.current?.querySelectorAll<HTMLElement>(`[${NAV_ITEM_ATTRIBUTE}]`) ?? []
      ),
    [resultsRef]
  );

  const move = useCallback(
    (delta: number) => {
      const all = items();
      if (all.length === 0) return;

      const current = all.findIndex((item) => item === document.activeElement);
      // Nothing focused yet: j enters at the top, k enters at the bottom.
      const nextIndex =
        current === -1
          ? delta > 0
            ? 0
            : all.length - 1
          : Math.min(Math.max(current + delta, 0), all.length - 1);

      const next = all[nextIndex];
      next?.focus();
      // Optional: jsdom does not implement it, and it is a nicety rather than the point.
      next?.scrollIntoView?.({ block: "nearest" });
    },
    [items]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const { onClearSearch: clear, hasSearch: searching } = stateRef.current;

      if (event.key === "Escape") {
        if (isTypingTarget(event.target) && searching) {
          clear();
          return;
        }
        if (isTypingTarget(event.target)) {
          (event.target as HTMLElement).blur();
        }
        return;
      }

      // Everything below is a bare shortcut, so it must never fire mid-word, and never
      // steal a browser or OS chord.
      if (isTypingTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "/") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }

      if (event.key === "j") {
        event.preventDefault();
        move(1);
        return;
      }

      if (event.key === "k") {
        event.preventDefault();
        move(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move, searchRef]);
}
