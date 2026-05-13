import type { Meta, StoryObj } from "@storybook/react";
import Link from "./Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    title: "Google",
    url: "https://google.com"
  }
};

export const OpenInNewTab: Story = {
  args: {
    title: "GitHub",
    url: "https://github.com",
    openInNewTab: true
  }
};

export const LongTitle: Story = {
  args: {
    title: "Running Route Estimator project documentation",
    url: "https://example.com/docs"
  }
};
