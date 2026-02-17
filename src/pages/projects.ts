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
  external: boolean;
  /** Component to render when the route is active */
  component?: React.ComponentType<{ project: Project }>;
}

export const PROJECTS: Project[] = [
  {
    id: "0",
    creationDate: new Date("2026-02-15"),
    disabled: false,
    title: "Component Library",
    type: "project",
    imageSrc: "/images/storybook-project-cover.png",
    description: "The storybook for my components library.",
    tags: ["code", "storybook", "lib"],
    external: true,
    path: "/storybook"
  },
  {
    id: "1",
    creationDate: new Date("2026-02-16"),
    disabled: false,
    title: "Running Route Estimator",
    type: "project",
    imageSrc: "/images/running-route-project-cover.png",
    description: "A utility to estimate the distance of a running route by drawing it on a map.",
    tags: ["running", "utility", "map"],
    external: false,
    path: "/project/1",
    component: RunningRouteEstimatorPage
  },
  {
    id: "2",
    creationDate: new Date("2026-02-17"),
    disabled: true,
    title: "Countdown",
    type: "project",
    imageSrc: "/images/calm-coutdown-project-cover.png",
    description: "A calm coutdown timer.",
    tags: ["timer", "utility"],
    path: "/project/2",
    external: false,
    component: CountDownPage
  }
];
