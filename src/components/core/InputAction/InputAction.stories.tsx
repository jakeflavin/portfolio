import type { Meta, StoryObj } from "@storybook/react";
import InputAction from "./InputAction";
import SearchIcon from "@/assets/icons/magnifying-glass.svg?react";

const meta: Meta<typeof InputAction> = {
  title: "Components/InputAction",
  component: InputAction
};

export default meta;
type Story = StoryObj<typeof InputAction>;

export const Default: Story = {
  args: {
    icon: <SearchIcon />,
    placeholder: "Search...",
    actionAriaLabel: "Search"
  }
};

export const WithValue: Story = {
  args: {
    icon: <SearchIcon />,
    value: "typed query",
    placeholder: "Search for a project...",
    actionAriaLabel: "Search"
  }
};
