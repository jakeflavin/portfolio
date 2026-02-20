import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Toggle from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Unchecked: Story = {
  args: {
    checked: false,
    onChange: () => {},
    label: "Enable option"
  }
};

export const Checked: Story = {
  args: {
    checked: true,
    onChange: () => {},
    label: "Enable option"
  }
};

export const WithoutLabel: Story = {
  args: {
    checked: false,
    onChange: () => {},
    "aria-label": "Toggle setting"
  }
};

export const Disabled: Story = {
  args: {
    checked: false,
    onChange: () => {},
    label: "Disabled toggle",
    disabled: true
  }
};

export const Controlled: Story = {
  render: function Controlled() {
    const [checked, setChecked] = useState(false);
    return (
      <Toggle
        checked={checked}
        onChange={setChecked}
        label="Play against bot"
      />
    );
  }
};
