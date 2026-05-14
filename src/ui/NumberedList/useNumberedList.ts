import React, { useState } from "react";

export function useNumberedList(children: React.ReactNode, truncate: number) {
  const [expanded, setExpanded] = useState(false);
  const items = React.Children.toArray(children);
  const total = items.length;
  const isTruncated = total > truncate;
  const visibleItems = expanded || !isTruncated ? items : items.slice(0, truncate);

  return {
    expanded,
    isTruncated,
    setExpanded,
    total,
    visibleItems
  };
}
