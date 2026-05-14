export function parseBreakpoint(value: string): number {
  return parseInt(value, 10) || 0;
}

export function getColumnCount(width: number, smPx: number, lgPx: number): number {
  if (width >= lgPx) return 3;
  if (width >= smPx) return 2;
  return 1;
}

export function assignColumns(heights: number[], columnCount: number): number[] {
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

export function getFallbackAssignment(itemCount: number, columnCount: number): number[] {
  return Array.from({ length: itemCount }, (_, index) => index % columnCount);
}
