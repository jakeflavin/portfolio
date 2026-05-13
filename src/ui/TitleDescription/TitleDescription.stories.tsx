import type { Meta, StoryObj } from "@storybook/react";
import TitleDescription from "./TitleDescription";

const meta: Meta<typeof TitleDescription> = {
  title: "Components/TitleDescription",
  component: TitleDescription
};

export default meta;
type Story = StoryObj<typeof TitleDescription>;

export const Default: Story = {
  args: {
    title: "Section Title",
    description:
      "This is the section description. It uses muted text styling and appears below the title in a block with rounded corners and a subtle shadow, similar to the Hero component."
  }
};

export const Short: Story = {
  args: {
    title: "Brief",
    description: "A short description."
  }
};

export const LongDescription: Story = {
  args: {
    title: "Running Route Estimator",
    description:
      "This project helps you visualize distance and pacing data for your runs. You can draw or import routes on a map, see elevation profiles, and estimate finish times based on your pace. Built with React and Mapbox for a smooth, interactive experience."
  }
};
