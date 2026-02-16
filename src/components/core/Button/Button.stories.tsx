import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button"
  }
};

export const WithClick: Story = {
  args: {
    children: "Click me",
    onClick: () => alert("Clicked!")
  }
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true
  }
};

export const Submit: Story = {
  args: {
    children: "Submit",
    type: "submit"
  }
};
