import React from "react";
import { Wrapper, Grid, Cell, Status } from "./TicTacToeBoard.styled";
import { useTicTacToe } from "./useTicTacToe";

export interface TicTacToeBoardProps {
  /** When true, O is played by a bot that picks random valid moves. Human plays X. */
  playAgainstBot?: boolean;
  /** Delay in ms before the bot plays (default 400). Ignored when playAgainstBot is false. */
  botDelay?: number;
  /** Optional class name for the wrapper. */
  className?: string;
}

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({
  playAgainstBot = false,
  botDelay = 400,
  className
}) => {
  const { board, gameOver, isBotTurn, playCell, statusMessage } = useTicTacToe({
    playAgainstBot,
    botDelay
  });

  return (
    <Wrapper className={className} role="group" aria-label="Tic-tac-toe game">
      <Status role="status" aria-live="polite">
        {statusMessage}
      </Status>
      <Grid aria-label="Game board">
        {board.map((value, index) => (
          <Cell
            key={index}
            type="button"
            disabled={value !== null || gameOver || isBotTurn}
            onClick={() => playCell(index)}
            aria-label={value ? `Cell ${index + 1}, ${value}` : `Cell ${index + 1}, empty`}
          >
            {value ?? ""}
          </Cell>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default TicTacToeBoard;
