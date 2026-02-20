import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "../../../test/test-utils";
import TicTacToeBoard from "./TicTacToeBoard";

describe("TicTacToeBoard", () => {
  it("renders status and nine cells", () => {
    render(<TicTacToeBoard />);
    expect(screen.getByRole("status")).toHaveTextContent("X's turn");
    const cells = screen.getAllByRole("button", { name: /^Cell \d+/i });
    expect(cells).toHaveLength(9);
  });

  it("places X on first click and O on second click", () => {
    render(<TicTacToeBoard />);
    const cell1 = screen.getByRole("button", { name: /Cell 1, empty/i });
    const cell2 = screen.getByRole("button", { name: /Cell 2, empty/i });

    fireEvent.click(cell1);
    expect(cell1).toHaveTextContent("X");
    expect(screen.getByRole("status")).toHaveTextContent("O's turn");

    fireEvent.click(cell2);
    expect(cell2).toHaveTextContent("O");
    expect(screen.getByRole("status")).toHaveTextContent("X's turn");
  });

  it("does not change cell when clicking an already filled cell", () => {
    render(<TicTacToeBoard />);
    const cell1 = screen.getByRole("button", { name: /Cell 1, empty/i });
    fireEvent.click(cell1);
    expect(cell1).toHaveTextContent("X");
    fireEvent.click(cell1);
    expect(cell1).toHaveTextContent("X");
  });

  it("declares X winner when X gets three in a row", () => {
    render(<TicTacToeBoard />);
    fireEvent.click(screen.getByRole("button", { name: /Cell 1, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 4, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 2, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 5, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 3, empty/i }));
    expect(screen.getByRole("status")).toHaveTextContent("X wins!");
  });

  it("declares O winner when O gets three in a column", () => {
    render(<TicTacToeBoard />);
    fireEvent.click(screen.getByRole("button", { name: /Cell 1, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 2, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 3, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 5, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 4, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 8, empty/i }));
    expect(screen.getByRole("status")).toHaveTextContent("O wins!");
  });

  it("declares draw when all cells filled with no winner", () => {
    render(<TicTacToeBoard />);
    // Click order that yields a draw: X at 1,2,6,7,9 and O at 3,4,5,8 (no line for either)
    const drawOrder = [1, 3, 2, 4, 6, 5, 7, 8, 9];
    for (const cellNum of drawOrder) {
      const btn = screen.getByRole("button", { name: new RegExp(`Cell ${cellNum}`, "i") });
      fireEvent.click(btn);
    }
    expect(screen.getByRole("status")).toHaveTextContent("Draw!");
  });

  it("disables cells after game over", () => {
    render(<TicTacToeBoard />);
    fireEvent.click(screen.getByRole("button", { name: /Cell 1, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 4, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 2, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 5, empty/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cell 3, empty/i }));
    expect(screen.getByRole("status")).toHaveTextContent("X wins!");
    const emptyCell = screen.getByRole("button", { name: /Cell 6, empty/i });
    expect(emptyCell).toBeDisabled();
  });

  it("accepts className", () => {
    const { container } = render(<TicTacToeBoard className="custom-board" />);
    expect(container.querySelector(".custom-board")).toBeInTheDocument();
  });
});