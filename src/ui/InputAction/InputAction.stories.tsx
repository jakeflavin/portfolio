import type { Meta, StoryObj } from "@storybook/react";
import InputAction from "./InputAction";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

const meta: Meta<typeof InputAction> = {
  title: "Components/InputAction",
  component: InputAction
};

export default meta;
type Story = StoryObj<typeof InputAction>;

export const Default: Story = {
  args: {
    icon: <MagnifyingGlassIcon size={16} />,
    placeholder: "Search...",
    actionAriaLabel: "Search"
  }
};

export const WithValue: Story = {
  args: {
    icon: <MagnifyingGlassIcon size={16} />,
    value: "typed query",
    placeholder: "Search for a project...",
    actionAriaLabel: "Search"
  }
};

export const WithLabel: Story = {
  args: {
    label: "Name",
    placeholder: "Google",
    value: ""
  }
};

export const WithError: Story = {
  args: {
    label: "URL",
    placeholder: "https://www.example.com",
    value: "not-a-valid-url",
    error: "URL must be a valid HTTPS address (e.g. https://www.google.com)."
  }
};
