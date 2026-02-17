import type { Meta, StoryObj } from "@storybook/react";
import LottieViewer from "./LottieViewer";
import calmBeachAnimation from "../../../assets/animations/calm-beach.json";

const meta: Meta<typeof LottieViewer> = {
  title: "Components/LottieViewer",
  component: LottieViewer,
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof LottieViewer>;

export const Default: Story = {
  args: {
    animationData: calmBeachAnimation,
    width: "200px",
    height: "200px"
  }
};

export const CustomSize: Story = {
  args: {
    animationData: calmBeachAnimation,
    width: "280px",
    height: "160px"
  }
};

export const WithLargeSize: Story = {
  args: {
    animationData: calmBeachAnimation,
    width: "100%",
    height: "65vh"
  }
};

export const FromUrl: Story = {
  args: {
    animationUrl: "/animations/calm-beach.json",
    width: "320px",
    height: "240px"
  }
};
