import React from "react";
import { SquaresFourIcon, RowsIcon } from "@phosphor-icons/react";
import { TabList, Tab } from "./ViewTabs.styled";

export type ViewMode = "feed" | "grid";

export interface ViewTabsProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

const TABS: { value: ViewMode; label: string; Icon: typeof RowsIcon }[] = [
  { value: "feed", label: "Feed", Icon: RowsIcon },
  { value: "grid", label: "Grid", Icon: SquaresFourIcon }
];

const ViewTabs: React.FC<ViewTabsProps> = ({ value, onChange }) => (
  <TabList role="tablist" aria-label="Project layout">
    {TABS.map(({ value: tab, label, Icon }) => (
      <Tab
        key={tab}
        type="button"
        role="tab"
        aria-selected={value === tab}
        $active={value === tab}
        onClick={() => onChange(tab)}
      >
        <Icon size={12} weight={value === tab ? "fill" : "regular"} aria-hidden="true" />
        {label}
      </Tab>
    ))}
  </TabList>
);

export default ViewTabs;
