import type { Meta, StoryObj } from "@storybook/react";
import DynamicColumnLayout from "./DynamicColumnLayout";

const meta: Meta<typeof DynamicColumnLayout> = {
  title: "Components/DynamicColumnLayout",
  component: DynamicColumnLayout
};

export default meta;
type Story = StoryObj<typeof DynamicColumnLayout>;

const sampleItems = [
  "First card or block",
  "Second card or block",
  "Third card or block",
  "Fourth card or block",
  "Fifth card or block"
];

export const Default: Story = {
  args: {
    children: sampleItems.map((text, i) => (
      <div
        key={i}
        style={{
          padding: "1rem",
          background: "var(--color-secondary, #f0f0f0)",
          borderRadius: "8px"
        }}
      >
        {text}
      </div>
    ))
  }
};

export const WithManyItems: Story = {
  args: {
    children: Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        style={{
          padding: "1rem",
          background: "var(--color-secondary, #f0f0f0)",
          borderRadius: "8px",
          height: `${80 + (i % 3) * 40}px`
        }}
      >
        Item {i + 1}
      </div>
    ))
  }
};
