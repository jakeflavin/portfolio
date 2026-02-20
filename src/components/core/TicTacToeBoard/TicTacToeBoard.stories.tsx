import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import TicTacToeBoard from "./TicTacToeBoard";
import Button from "../Button";

const meta: Meta<typeof TicTacToeBoard> = {
  title: "Components/TicTacToeBoard",
  component: TicTacToeBoard
};

export default meta;
type Story = StoryObj<typeof TicTacToeBoard>;

export const Default: Story = {};

export const VsBot: Story = {
  args: {
    playAgainstBot: true
  }
};

export const WithReset: Story = {
  render: function WithReset() {
    const [key, setKey] = useState(0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
        <TicTacToeBoard key={key} />
        <Button onClick={() => setKey((k) => k + 1)}>New game</Button>
      </div>
    );
  }
};
