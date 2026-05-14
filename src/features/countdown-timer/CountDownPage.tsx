import React from "react";
import TitleDescription from "@/ui/TitleDescription";
import { Project } from "@/features/projects/projects";
import CountdownTimer from "./CountdownTimer";
import InputAction from "@/ui/InputAction";
import Button from "@/ui/Button";
import LottieViewer from "./LottieViewer";
import {
  ActionContainer,
  Container,
  FormContainer,
  LeftColumn,
  RightColumn,
  TimerSurface
} from "./CountDownPage.styled";
import { useCountdownPage } from "./useCountdownPage";

interface CountDownPageProps {
  project: Project;
}

const CountDownPage: React.FC<CountDownPageProps> = ({ project }) => {
  const { hours, minutes, play, seconds, setHours, setMinutes, setSeconds, togglePlay } =
    useCountdownPage();

  return (
    <Container>
      <LeftColumn>
        <TitleDescription title={project.title} description={project.description} />
        <FormContainer padding="md" variant="secondary" shadow="mdDown">
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
        <ActionContainer padding="md" variant="secondary" shadow="mdDown">
          <Button onClick={togglePlay}>Start/Stop</Button>
        </ActionContainer>
      </LeftColumn>
      <RightColumn>
        <TimerSurface padding="lg" variant="secondary" shadow="md">
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

export default CountDownPage;
