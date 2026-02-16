import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar";

const meta: Meta<typeof NavBar> = {
  title: "Components/NavBar",
  component: NavBar,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <Story />
      </MemoryRouter>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
  args: {
    isDarkMode: false
  }
};

export const DarkMode: Story = {
  args: {
    isDarkMode: true,
    onToggleDarkMode: () => {}
  }
};
