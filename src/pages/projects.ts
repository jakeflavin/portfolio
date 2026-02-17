import React from "react";
import type { CardType } from "../components/core/Card";
import RunningRouteEstimatorPage from "./projects/RunningRouteEstimatorPage";
import CountDownPage from "./projects/CountDownPage";

export interface Project {
  id: string;
  creationDate: Date;
  disabled: boolean;
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
    creationDate: new Date("2026-02-16"),
    disabled: false,
    title: "Running Route Estimator",
    type: "project",
    imageSrc: "/images/running-route-project-cover.png",
    description: "A utility to estimate the distance of a running route by drawing it on a map.",
    tags: ["running", "utility", "map"],
    path: "/project/1",
    component: RunningRouteEstimatorPage
  },
  {
    id: "2",
    creationDate: new Date("2026-02-17"),
    disabled: false,
    title: "Countdown",
    type: "project",
    imageSrc: "/images/calm-coutdown-project-cover.png",
    description: "A calm coutdown timer.",
    tags: ["timer", "utility"],
    path: "/project/2",
    component: CountDownPage
  }
];
