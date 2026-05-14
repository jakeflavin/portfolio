import type { Meta, StoryObj } from "@storybook/react";
import IconButton from "./IconButton";
import { HouseIcon, MoonIcon } from "@phosphor-icons/react";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: <HouseIcon size={20} />,
    ariaLabel: "Home"
  }
};

export const WithActiveState: Story = {
  args: {
    icon: <MoonIcon size={20} />,
    activeIcon: <MoonIcon size={20} weight="fill" />,
    active: true,
    ariaLabel: "Toggle dark mode"
  }
};

export const CustomSize: Story = {
  args: {
    icon: <HouseIcon size={32} />,
    size: 32,
    ariaLabel: "Home"
  }
};
