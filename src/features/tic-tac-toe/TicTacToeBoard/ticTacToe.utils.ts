export type Player = "X" | "O";
export type CellValue = Player | null;

export const INITIAL_BOARD: CellValue[] = Array(9).fill(null);

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

export function getWinner(board: CellValue[]): Player | null {
  for (const [a, b, c] of LINES) {
    const value = board[a];
    if (value && value === board[b] && value === board[c]) return value;
  }
  return null;
}

export function isDraw(board: CellValue[]): boolean {
  return board.every((cell) => cell !== null);
}

export function getEmptyIndices(board: CellValue[]): number[] {
  return board.map((value, index) => (value === null ? index : -1)).filter((index) => index >= 0);
}

export function getRandomBotMove(board: CellValue[]): number | null {
  const empty = getEmptyIndices(board);
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

export function getNextPlayer(player: Player): Player {
  return player === "X" ? "O" : "X";
}

export function getStatusMessage({
  winner,
  draw,
  isBotTurn,
  nextPlayer
}: {
  winner: Player | null;
  draw: boolean;
  isBotTurn: boolean;
  nextPlayer: Player;
}): string {
  if (winner) return `${winner} wins!`;
  if (draw) return "Draw!";
  if (isBotTurn) return "Bot is thinking...";
  return `${nextPlayer}'s turn`;
}
