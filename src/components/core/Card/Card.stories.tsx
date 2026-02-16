import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: "Run Distance Estimator",
    type: "project",
    imageSrc: "/images/mockup-example-1.png",
    description: "Visualize distance and pacing data.",
    tags: ["React", "Firebase"]
  }
};

export const WithAction: Story = {
  args: {
    title: "Clickable Project",
    type: "project",
    imageSrc: "/images/mockup-example-1.png",
    description: "This card has an onAction handler.",
    tags: ["TypeScript", "Vite"],
    onAction: () => alert("Card clicked!")
  }
};