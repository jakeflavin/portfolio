import { useCallback, useEffect, useState } from "react";
import {
  getNextPlayer,
  getRandomBotMove,
  getStatusMessage,
  getWinner,
  INITIAL_BOARD,
  isDraw,
  type CellValue,
  type Player
} from "./ticTacToe.utils";

interface UseTicTacToeOptions {
  playAgainstBot: boolean;
  botDelay: number;
}

export function useTicTacToe({ playAgainstBot, botDelay }: UseTicTacToeOptions) {
  const [board, setBoard] = useState<CellValue[]>(() => [...INITIAL_BOARD]);
  const [nextPlayer, setNextPlayer] = useState<Player>("X");

  const winner = getWinner(board);
  const draw = isDraw(board);
  const gameOver = !!winner || draw;
  const isBotTurn = playAgainstBot && nextPlayer === "O" && !gameOver;

  useEffect(() => {
    if (!isBotTurn) return;

    const id = window.setTimeout(() => {
      setBoard((prev) => {
        const index = getRandomBotMove(prev);
        if (index === null) return prev;

        const next = [...prev];
        next[index] = "O";
        return next;
      });
      setNextPlayer("X");
    }, botDelay);

    return () => window.clearTimeout(id);
  }, [isBotTurn, botDelay]);

  const playCell = useCallback(
    (index: number) => {
      if (board[index] !== null || gameOver) return;

      const next = [...board];
      next[index] = nextPlayer;
      setBoard(next);
      setNextPlayer(getNextPlayer(nextPlayer));
    },
    [board, nextPlayer, gameOver]
  );

  return {
    board,
    gameOver,
    isBotTurn,
    playCell,
    statusMessage: getStatusMessage({ winner, draw, isBotTurn, nextPlayer })
  };
}
