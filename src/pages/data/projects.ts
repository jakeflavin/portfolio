import React from "react";
import type { CardType } from "../../components/core/Card";
import RunningRouteEstimatorPage from "../projects/RunningRouteEstimatorPage";
import CountDownPage from "../projects/CountDownPage";
import CoolLinksPage from "../projects/CoolLinksPage";
import TicTacToePage from "../projects/TicTacToePage";
import MadlibsPage from "../projects/MadlibsPage";

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
    disabled: false,
    title: "Countdown Timer",
    type: "project",
    imageSrc: "/images/calm-coutdown-project-cover.png",
    description: "A coutdown timer with calming animations.",
    tags: ["timer", "utility"],
    path: "/project/2",
    external: false,
    component: CountDownPage
  },
  {
    id: "3",
    creationDate: new Date("2026-02-18"),
    disabled: false,
    title: "Cool Links",
    type: "project",
    imageSrc: "/images/cool-links-project-cover.png",
    description: "A collection of cool links categorized by topic.",
    tags: ["links", "collection"],
    path: "/project/3",
    external: false,
    component: CoolLinksPage
  },
  {
    id: "4",
    creationDate: new Date("2026-02-20"),
    disabled: false,
    title: "Tic Tac Toe",
    type: "project",
    imageSrc: "/images/tic-tac-toe-project-cover.png",
    description: "Classic tic-tac-toe game with a bot.",
    tags: ["game", "tic-tac-toe"],
    path: "/project/4",
    external: false,
    component: TicTacToePage
  },
  {
    id: "5",
    creationDate: new Date("2026-02-23"),
    disabled: false,
    title: "Mad Libs",
    type: "project",
    imageSrc: "/images/mad-lib-project-cover.png",
    description: "Fill in the blanks and generate silly stories with configurable templates.",
    tags: ["game", "mad libs", "stories"],
    path: "/project/5",
    external: false,
    component: MadlibsPage
  }
];
