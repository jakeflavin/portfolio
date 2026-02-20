import React, { useState, useCallback, useEffect } from "react";
import { Wrapper, Grid, Cell, Status } from "./TicTacToeBoard.styled";

export type Player = "X" | "O";
export type CellValue = Player | null;

const LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function getWinner(board: CellValue[]): Player | null {
  for (const [a, b, c] of LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return v;
  }
  return null;
}

function isDraw(board: CellValue[]): boolean {
  return board.every((c) => c !== null);
}

const INITIAL_BOARD: CellValue[] = Array(9).fill(null);

export interface TicTacToeBoardProps {
  /** When true, O is played by a bot that picks random valid moves. Human plays X. */
  playAgainstBot?: boolean;
  /** Delay in ms before the bot plays (default 400). Ignored when playAgainstBot is false. */
  botDelay?: number;
  /** Optional class name for the wrapper. */
  className?: string;
}

function getEmptyIndices(board: CellValue[]): number[] {
  return board.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0);
}

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({
  playAgainstBot = false,
  botDelay = 400,
  className
}) => {
  const [board, setBoard] = useState<CellValue[]>(() => [...INITIAL_BOARD]);
  const [nextPlayer, setNextPlayer] = useState<Player>("X");

  const winner = getWinner(board);
  const draw = isDraw(board);
  const gameOver = !!winner || draw;
  const isBotTurn = playAgainstBot && nextPlayer === "O" && !gameOver;

  useEffect(() => {
    if (!isBotTurn) return;
    const id = setTimeout(() => {
      setBoard((prev) => {
        const empty = getEmptyIndices(prev);
        if (empty.length === 0) return prev;
        const idx = empty[Math.floor(Math.random() * empty.length)];
        const next = [...prev];
        next[idx] = "O";
        return next;
      });
      setNextPlayer("X");
    }, botDelay);
    return () => clearTimeout(id);
  }, [isBotTurn, botDelay]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] !== null || gameOver) return;
      const newBoard = [...board];
      newBoard[index] = nextPlayer;
      setBoard(newBoard);
      setNextPlayer((p) => (p === "X" ? "O" : "X"));
    },
    [board, nextPlayer, gameOver]
  );

  const statusMessage = winner
    ? `${winner} wins!`
    : draw
      ? "Draw!"
      : isBotTurn
        ? "Bot is thinking..."
        : `${nextPlayer}'s turn`;

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
            onClick={() => handleCellClick(index)}
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
