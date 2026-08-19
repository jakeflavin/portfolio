import React from "react";
import { LayoutGrid, Rows3, StretchHorizontal } from "lucide-react";
import { Segmented, Segment } from "./ViewToggle.styled";
import { VIEW_OPTIONS, type ViewValue } from "@/lib/home.utils";

const ICONS: Record<ViewValue, React.ReactNode> = {
  cards: <StretchHorizontal size={16} />,
  grid: <LayoutGrid size={16} />,
  list: <Rows3 size={16} />
};

export interface ViewToggleProps {
  value: ViewValue;
  onChange: (value: ViewValue) => void;
}

/**
 * Icon-only, because the row has to stay on one line on a phone and the labels were the
 * first thing to give. The accessible name carries the label instead.
 */
const ViewToggle: React.FC<ViewToggleProps> = ({ value, onChange }) => (
  <Segmented role="group" aria-label="Layout">
    {VIEW_OPTIONS.map((option) => (
      <Segment
        key={option.value}
        type="button"
        $active={value === option.value}
        aria-pressed={value === option.value}
        aria-label={`${option.label} view`}
        title={`${option.label} view`}
        onClick={() => onChange(option.value)}
      >
        {ICONS[option.value]}
      </Segment>
    ))}
  </Segmented>
);

export default ViewToggle;
