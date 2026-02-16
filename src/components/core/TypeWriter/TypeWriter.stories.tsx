import type { Meta, StoryObj } from "@storybook/react";
import TypeWriter from "./TypeWriter";

const meta: Meta<typeof TypeWriter> = {
  title: "Components/TypeWriter",
  component: TypeWriter
};

export default meta;
type Story = StoryObj<typeof TypeWriter>;

export const Default: Story = {
  args: {
    sentences: [
      "Hi, I'm Jake.",
      "I build useful tools.",
      "I design clean systems.",
      "Welcome to my portfolio."
    ]
  }
};

export const Fast: Story = {
  args: {
    sentences: ["Quick typing.", "Fast deletion."],
    typingSpeed: 30,
    deletingSpeed: 20,
    pauseTime: 500
  }
};
