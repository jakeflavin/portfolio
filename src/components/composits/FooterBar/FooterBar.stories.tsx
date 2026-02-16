import type { Meta, StoryObj } from "@storybook/react";
import FooterBar from "./FooterBar";

const meta: Meta<typeof FooterBar> = {
  title: "Components/FooterBar",
  component: FooterBar
};

export default meta;
type Story = StoryObj<typeof FooterBar>;

export const Default: Story = {};
