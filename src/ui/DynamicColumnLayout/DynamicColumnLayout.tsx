import React, { useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";
import { PageContainer, Column, ItemWrap } from "./DynamicColumnLayout.styled";

export interface DynamicColumnLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/** Parses a theme breakpoint string (e.g. "600px") to a pixel number. */
function parseBreakpoint(value: string): number {
  return parseInt(value, 10) || 0;
}

/** Returns column count for layout from container width and breakpoints. */
function getColumnCount(width: number, smPx: number, lgPx: number): number {
  if (width >= lgPx) return 3;
  if (width >= smPx) return 2;
  return 1;
}

/** Assigns each item to a column so column heights are balanced (greedy). */
function assignColumns(heights: number[], columnCount: number): number[] {
  const columnHeights = new Array(columnCount).fill(0);
  const assignment: number[] = [];
  for (let i = 0; i < heights.length; i++) {
    let minCol = 0;
    for (let c = 1; c < columnCount; c++) {
      if (columnHeights[c] < columnHeights[minCol]) minCol = c;
    }
    assignment[i] = minCol;
    columnHeights[minCol] += heights[i];
  }
  return assignment;
}

const DynamicColumnLayout: React.FC<DynamicColumnLayoutProps> = ({ children, className }) => {
  const theme = useTheme() as { breakpoints?: { sm?: string; md?: string; lg?: string } };
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [columnCount, setColumnCount] = useState(1);
  const [assignment, setAssignment] = useState<number[]>([]);

  const smPx = parseBreakpoint(theme?.breakpoints?.sm ?? "600px");
  const lgPx = parseBreakpoint(theme?.breakpoints?.lg ?? "1200px");

  const items = React.Children.toArray(children);
  const count = items.length;
  const displayAssignment =
    assignment.length === count ? assignment : items.map((_, i) => i % columnCount);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateColumnCount = () => {
      const w = el.offsetWidth;
      setColumnCount(getColumnCount(w, smPx, lgPx));
    };

    updateColumnCount();
    const ro = new ResizeObserver(updateColumnCount);
    ro.observe(el);
    return () => ro.disconnect();
  }, [smPx, lgPx]);

  useLayoutEffect(() => {
    setAssignment([]);
  }, [columnCount]);

  useLayoutEffect(() => {
    if (count === 0 || columnCount === 0) return;
    const refs = itemRefs.current;
    const heights = Array.from({ length: count }, (_, i) => refs[i]?.offsetHeight ?? 0);
    if (heights.some((h) => h === 0)) return;
    const next = assignColumns(heights, columnCount);
    setAssignment((prev) => (prev.length === count && next.every((v, i) => v === prev[i]) ? prev : next));
  }, [columnCount, count]);

  return (
    <PageContainer ref={containerRef} className={className}>
      {Array.from({ length: columnCount }, (_, col) => (
        <Column key={col}>
          {items
            .map((child, i) => ({ child, i }))
            .filter(({ i }) => displayAssignment[i] === col)
            .map(({ child, i }) => (
              <ItemWrap key={i} ref={(el) => { itemRefs.current[i] = el; }}>
                {child}
              </ItemWrap>
            ))}
        </Column>
      ))}
    </PageContainer>
  );
};

export default DynamicColumnLayout;
