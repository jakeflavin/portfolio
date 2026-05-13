import React, { useState } from "react";
import styled from "styled-components";
import TitleDescription from "../../components/core/TitleDescription";
import { StyledSurface } from "../../components/core/Surface";
import { Project } from "../data/projects";
import CountdownTimer from "../../components/core/CountdownTimer";
import InputAction from "../../components/core/InputAction";
import Button from "../../components/core/Button";
import LottieViewer from "../../components/core/LottieViewer";

interface CountDownPageProps {
  project: Project;
}

const CountDownPage: React.FC<CountDownPageProps> = ({ project }) => {
  const [play, setPlay] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  return (
    <Container>
      <LeftColumn>
        <TitleDescription title={project.title} description={project.description} />
      <FormContainer>
          <InputAction
            value={hours.toString()}
            onChange={(e) => setHours(parseInt(e.target.value, 10) || 0)}
            placeholder="HH"
            disabled={play}
            label="Hours"
          />
          <InputAction
            value={minutes.toString()}
            onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 0)}
            placeholder="MM"
            disabled={play}
            label="Minutes"
          />
          <InputAction
            value={seconds.toString()}
            onChange={(e) => setSeconds(parseInt(e.target.value, 10) || 0)}
            placeholder="SS"
            disabled={play}
            label="Seconds"
          />
      </FormContainer>
      <ActionContainer>
        <Button onClick={() => setPlay((prev) => !prev)}>Start/Stop</Button>
      </ActionContainer>
      </LeftColumn>
      <RightColumn>
        <TimerSurface>
          <CountdownTimer hours={hours} minutes={minutes} seconds={seconds} play={play} />
        </TimerSurface>
        <LottieViewer
          animationUrl="/animations/calm-beach.json"
          width="100%"
          height="65vh"
        />
      </RightColumn>
    </Container>
  );
};


const FormContainer = styled(StyledSurface).attrs({
  $padding: "md",
  $variant: "secondary",
  $shadow: "mdDown"
})`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
`;

const ActionContainer = styled(StyledSurface).attrs({
  $padding: "md",
  $variant: "secondary",
  $shadow: "mdDown"
})`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

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

const RightColumn = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TimerSurface = styled(StyledSurface).attrs({
  $padding: "lg",
  $variant: "secondary",
  $shadow: "md"
})`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default CountDownPage;