import React, { useState } from "react";
import styled from "styled-components";
import TitleDescription from "../../components/core/TitleDescription";
import TicTacToeBoard from "../../components/core/TicTacToeBoard";
import Toggle from "../../components/core/Toggle";
import Button from "../../components/core/Button";
import type { Project } from "../data/projects";

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

const ActionsPanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.mdDown};
`;



const RightColumn = styled.div`
  display: flex;
  align-items: stretch;
  min-width: 0;
  width: 100%;
`;

const BoardSurface = styled.div`
  flex: 1;
  width: 100%;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
`;

export default TicTacToePage;
