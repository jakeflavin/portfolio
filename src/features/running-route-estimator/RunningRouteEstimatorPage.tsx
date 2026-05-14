import React from "react";
import type { Project } from "@/features/projects/projects";
import Map from "./Map";
import TitleDescription from "@/ui/TitleDescription";
import Button from "@/ui/Button";
import {
  ButtonBlock,
  Container,
  LeftColumn,
  MapWrapper,
  TotalMilesBlock,
  TotalMilesLabel,
  TotalMilesValue
} from "./RunningRouteEstimatorPage.styled";
import { useRunningRouteEstimator } from "./useRunningRouteEstimator";

interface RunningRouteEstimatorPageProps {
  project: Project;
}

const RunningRouteEstimatorPage: React.FC<RunningRouteEstimatorPageProps> = ({ project }) => {
  const { points, totalMiles, addPoint, clearPoints, removeLastPoint } = useRunningRouteEstimator();

  return (
    <Container>
      <LeftColumn>
        <TitleDescription title={project.title} description={project.description} />
        <ButtonBlock padding="md" variant="secondary" shadow="md">
          <Button onClick={clearPoints} disabled={points.length === 0}>Start Over</Button>
          <Button onClick={removeLastPoint} disabled={points.length === 0}>Remove Last Point</Button>
        </ButtonBlock>
        <TotalMilesBlock padding="md" variant="secondary" shadow="md">
          <TotalMilesLabel>Total Miles</TotalMilesLabel>
          <TotalMilesValue>{totalMiles.toFixed(2)}</TotalMilesValue>
        </TotalMilesBlock>
      </LeftColumn>
      <MapWrapper>
        <Map points={points} onMapClick={addPoint} />
      </MapWrapper>
    </Container>
  );
};

export default RunningRouteEstimatorPage;
