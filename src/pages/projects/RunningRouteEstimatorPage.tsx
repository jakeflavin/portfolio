import React, { useState, useMemo } from "react";
import type { Project } from "../data/projects";
import Map, { type MapPoint } from "../../components/core/Map";
import TitleDescription from "../../components/core/TitleDescription";
import styled from "styled-components";
import Button from "../../components/core/Button";

/** Haversine distance between two points in miles */
function distanceMiles(a: MapPoint, b: MapPoint): number {
  const R = 3959; // Earth radius in miles
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/** Sums the distance between consecutive points in miles. */
function totalDistanceMiles(pts: MapPoint[]): number {
  if (pts.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += distanceMiles(pts[i - 1], pts[i]);
  }
  return total;
}

interface RunningRouteEstimatorPageProps {
  project: Project;
}

const RunningRouteEstimatorPage: React.FC<RunningRouteEstimatorPageProps> = ({ project }) => {
  // Points managed here so other components can show total miles, delete points, etc.
  const [points, setPoints] = useState<MapPoint[]>([]);

  const totalMiles = useMemo(() => totalDistanceMiles(points), [points]);

  const handleMapClick = (point: MapPoint) => {
    setPoints((prev) => [...prev, point]);
  };

  return (
    <Container>
      <LeftColumn>
        <TitleDescription title={project.title} description={project.description} />
        <Button onClick={() => setPoints([])} disabled={points.length === 0}>Start Over</Button>
        <Button onClick={() => setPoints((prev) => prev.slice(0, -1))} disabled={points.length === 0}>Remove Last Point</Button>
        <TotalMilesBlock>
          <TotalMilesLabel>Total Miles</TotalMilesLabel>
          <TotalMilesValue>{totalMiles.toFixed(2)}</TotalMilesValue>
        </TotalMilesBlock>
      </LeftColumn>
      <MapWrapper>
        <Map points={points} onMapClick={handleMapClick} />
      </MapWrapper>
      {/* TODO: e.g. list of points with delete-per-point */}
    </Container>
  );
};

const TotalMilesBlock = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const TotalMilesLabel = styled.div`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
`;

const TotalMilesValue = styled.div`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MapWrapper = styled.div`
  min-height: 300px;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    grid-template-columns: 1fr 2fr;
  }
`;

export default RunningRouteEstimatorPage;
