import type { Meta, StoryObj } from "@storybook/react";
import Surface from "@/ui/Surface";
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
      <Surface key={i} padding="md" variant="secondary" shadow="sm">
        {text}
      </Surface>
    ))
  }
};

export const WithManyItems: Story = {
  args: {
    children: Array.from({ length: 12 }, (_, i) => (
      <Surface
        key={i}
        padding="md"
        variant="secondary"
        shadow="sm"
        style={{ height: `${80 + (i % 3) * 40}px` }}
      >
        Item {i + 1}
      </Surface>
    ))
  }
};
