import type { Meta, StoryObj } from "@storybook/react";
import Bar from "./Bar";

const meta: Meta<typeof Bar> = {
  title: "Components/Bar",
  component: Bar
};

export default meta;
type Story = StoryObj<typeof Bar>;

export const Center: Story = {
  args: {
    align: "center",
    children: "Centered content"
  }
};

export const SpaceBetween: Story = {
  args: {
    align: "space-between",
    children: (
      <>
        <span>Left</span>
        <span>Right</span>
      </>
    )
  }
};
