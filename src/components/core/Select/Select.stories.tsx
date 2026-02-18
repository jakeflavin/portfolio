import type { Meta, StoryObj } from "@storybook/react";
import Select from "./Select";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" }
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    options,
    "aria-label": "Choose option"
  }
};

export const WithPlaceholder: Story = {
  args: {
    options,
    placeholder: "Select…",
    "aria-label": "Choose option"
  }
};

export const WithValue: Story = {
  args: {
    options,
    value: "b",
    "aria-label": "Choose option"
  }
};

export const Disabled: Story = {
  args: {
    options,
    value: "a",
    disabled: true,
    "aria-label": "Choose option"
  }
};

export const WithError: Story = {
  args: {
    options,
    placeholder: "Select a category",
    "aria-label": "Category",
    error: "Please select a category."
  }
};
