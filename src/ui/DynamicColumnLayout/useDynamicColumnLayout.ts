import { useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";
import {
  assignColumns,
  getColumnCount,
  getFallbackAssignment,
  parseBreakpoint
} from "./dynamicColumnLayout.utils";

interface ThemeWithBreakpoints {
  breakpoints?: {
    sm?: string;
    lg?: string;
  };
}

export function useDynamicColumnLayout(itemCount: number) {
  const theme = useTheme() as ThemeWithBreakpoints;
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [columnCount, setColumnCount] = useState(1);
  const [assignment, setAssignment] = useState<number[]>([]);

  const smPx = parseBreakpoint(theme.breakpoints?.sm ?? "600px");
  const lgPx = parseBreakpoint(theme.breakpoints?.lg ?? "1200px");

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateColumnCount = () => {
      setColumnCount(getColumnCount(el.offsetWidth, smPx, lgPx));
    };

    updateColumnCount();
    const observer = new ResizeObserver(updateColumnCount);
    observer.observe(el);

    return () => observer.disconnect();
  }, [smPx, lgPx]);

  useLayoutEffect(() => {
    setAssignment([]);
  }, [columnCount]);

  useLayoutEffect(() => {
    if (itemCount === 0 || columnCount === 0) return;

    const heights = Array.from(
      { length: itemCount },
      (_, index) => itemRefs.current[index]?.offsetHeight ?? 0
    );
    if (heights.some((height) => height === 0)) return;

    const next = assignColumns(heights, columnCount);
    setAssignment((prev) =>
      prev.length === itemCount && next.every((value, index) => value === prev[index])
        ? prev
        : next
    );
  }, [columnCount, itemCount]);

  return {
    containerRef,
    itemRefs,
    columnCount,
    assignment:
      assignment.length === itemCount
        ? assignment
        : getFallbackAssignment(itemCount, columnCount)
  };
}
