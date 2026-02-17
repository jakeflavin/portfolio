import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import Button from "../Button";

const meta: Meta<typeof CountdownTimer> = {
  title: "Components/CountdownTimer",
  component: CountdownTimer
};

export default meta;
type Story = StoryObj<typeof CountdownTimer>;

export const Default: Story = {
  args: {
    hours: 0,
    minutes: 1,
    seconds: 30
  }
};

export const Paused: Story = {
  args: {
    hours: 0,
    minutes: 2,
    seconds: 0,
    play: false
  }
};

export const WithPlayToggle: Story = {
  render: function WithPlayToggle() {
    const [play, setPlay] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
        <CountdownTimer hours={0} minutes={1} seconds={0} play={play} />
        <Button onClick={() => setPlay((p) => !p)}>
          {play ? "Pause" : "Start"}
        </Button>
      </div>
    );
  }
};

export const ShortCountdown: Story = {
  args: {
    minutes: 0,
    seconds: 10,
    play: true
  },
  parameters: {
    docs: {
      description: {
        story: "10-second countdown with play true (runs in Storybook)."
      }
    }
  }
};
