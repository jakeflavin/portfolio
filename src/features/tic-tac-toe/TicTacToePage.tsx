import React, { useState } from "react";
import styled from "styled-components";
import TitleDescription from "@/ui/TitleDescription";
import { StyledSurface } from "@/ui/Surface";
import TicTacToeBoard from "./TicTacToeBoard";
import Toggle from "@/ui/Toggle";
import Button from "@/ui/Button";
import type { Project } from "@/features/projects/projects";

interface TicTacToePageProps {
  project: Project;
}

const TicTacToePage: React.FC<TicTacToePageProps> = ({ project }) => {
  const [gameKey, setGameKey] = useState(0);
  const [playAgainstBot, setPlayAgainstBot] = useState(true);

  return (
    <Container>
      <LeftColumn>
        <TitleDescription title={project.title} description={project.description} />
        <ActionsPanel>
          <Toggle
              checked={playAgainstBot}
              onChange={setPlayAgainstBot}
              label="Play against bot"
            />
          </ActionsPanel>
          <ActionsPanel>
            <Button onClick={() => setGameKey((k) => k + 1)}>New Game</Button>
         
        </ActionsPanel>
      </LeftColumn>
      <RightColumn>
        <BoardSurface>
          <TicTacToeBoard key={gameKey} playAgainstBot={playAgainstBot} />
        </BoardSurface>
      </RightColumn>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;

  ${({ theme }) => theme.media.md} {
    grid-template-columns: minmax(0, 280px) 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

const ActionsPanel = styled(StyledSurface).attrs({
  $padding: "md",
  $variant: "secondary",
  $shadow: "mdDown"
})`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RightColumn = styled.div`
  display: flex;
  align-items: stretch;
  min-width: 0;
  width: 100%;
`;

const BoardSurface = styled(StyledSurface).attrs({
  $padding: "lg",
  $variant: "secondary",
  $shadow: "md"
})`
  flex: 1;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export default TicTacToePage;
