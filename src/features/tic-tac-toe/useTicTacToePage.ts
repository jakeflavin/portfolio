import { useState } from "react";

export function useTicTacToePage() {
  const [gameKey, setGameKey] = useState(0);
  const [playAgainstBot, setPlayAgainstBot] = useState(true);

  return {
    gameKey,
    playAgainstBot,
    setPlayAgainstBot,
    startNewGame: () => setGameKey((key) => key + 1)
  };
}
