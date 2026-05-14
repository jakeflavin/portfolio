import React from "react";
import TitleDescription from "@/ui/TitleDescription";
import TicTacToeBoard from "./TicTacToeBoard";
import Toggle from "@/ui/Toggle";
import Button from "@/ui/Button";
import type { Project } from "@/features/projects/projects";
import {
  ActionsPanel,
  BoardSurface,
  Container,
  LeftColumn,
  RightColumn
} from "./TicTacToePage.styled";
import { useTicTacToePage } from "./useTicTacToePage";

interface TicTacToePageProps {
  project: Project;
}

const TicTacToePage: React.FC<TicTacToePageProps> = ({ project }) => {
  const { gameKey, playAgainstBot, setPlayAgainstBot, startNewGame } = useTicTacToePage();

  return (
    <Container>
      <LeftColumn>
        <TitleDescription title={project.title} description={project.description} />
        <ActionsPanel padding="md" variant="secondary" shadow="mdDown">
          <Toggle
            checked={playAgainstBot}
            onChange={setPlayAgainstBot}
            label="Play against bot"
          />
        </ActionsPanel>
        <ActionsPanel padding="md" variant="secondary" shadow="mdDown">
          <Button onClick={startNewGame}>New Game</Button>
        </ActionsPanel>
      </LeftColumn>
      <RightColumn>
        <BoardSurface padding="lg" variant="secondary" shadow="md">
          <TicTacToeBoard key={gameKey} playAgainstBot={playAgainstBot} />
        </BoardSurface>
      </RightColumn>
    </Container>
  );
};

export default TicTacToePage;
