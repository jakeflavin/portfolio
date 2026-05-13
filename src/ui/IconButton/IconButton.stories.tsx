import type { Meta, StoryObj } from "@storybook/react";
import IconButton from "./IconButton";
import HouseIcon from "@/assets/icons/house-blank.svg?react";
import MoonIcon from "@/assets/icons/moon.svg?react";
import MoonActiveIcon from "@/assets/icons/moon-active.svg?react";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: <HouseIcon />,
    ariaLabel: "Home"
  }
};

export const WithActiveState: Story = {
  args: {
    icon: <MoonIcon />,
    activeIcon: <MoonActiveIcon />,
    active: true,
    ariaLabel: "Toggle dark mode"
  }
};

export const CustomSize: Story = {
  args: {
    icon: <HouseIcon />,
    size: 32,
    ariaLabel: "Home"
  }
};
