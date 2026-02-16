import React from "react";
import type { CardType } from "../components/core/Card";
import RunningRouteEstimatorPage from "./projects/RunningRouteEstimatorPage";

export interface Project {
  id: string;
  title: string;
  type: CardType;
  imageSrc: string;
  description: string;
  tags?: string[];
  /** Route path for this project */
  path: string;
  /** Component to render when the route is active */
  component: React.ComponentType<{ project: Project }>;
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Running Route Estimator",
    type: "project",
    imageSrc: "/images/mockup-example-1.png",
    description: "A utility to estimate the distance of a running route based on the user's pace and the route's elevation profile.",
    tags: ["Running", "Utility"],
    path: "/project/1",
    component: RunningRouteEstimatorPage
  }
];
