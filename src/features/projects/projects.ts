import React from "react";
import type { CardType } from "@/ui/Card";
import RunningRouteEstimatorPage from "@/features/running-route-estimator/RunningRouteEstimatorPage";
import CountDownPage from "@/features/countdown-timer/CountDownPage";
import CoolLinksPage from "@/features/cool-links/CoolLinksPage";
import TicTacToePage from "@/features/tic-tac-toe/TicTacToePage";
import MadlibsPage from "@/features/madlibs/MadlibsPage";
import LocalWeatherPage from "@/features/local-weather/LocalWeatherPage";
import TipCalculatorPage from "@/features/tip-calculator/TipCalculatorPage";
import RunPaceCalculatorPage from "@/features/run-pace-calculator/RunPaceCalculatorPage";
import ClassroomNoiseIndicatorPage from "@/features/classroom-noise-indicator/ClassroomNoiseIndicatorPage";

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
    imageSrc: "/images/storybook-project-cover.svg",
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
    imageSrc: "/images/running-route-project-cover.svg",
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
    imageSrc: "/images/countdown-timer-project-cover.svg",
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
    imageSrc: "/images/cool-links-project-cover.svg",
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
    imageSrc: "/images/tic-tac-toe-project-cover.svg",
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
    imageSrc: "/images/mad-lib-project-cover.svg",
    description: "Fill in the blanks and generate silly stories with configurable templates.",
    tags: ["game", "mad libs", "stories"],
    path: "/project/5",
    external: false,
    component: MadlibsPage
  },
  {
    id: "6",
    creationDate: new Date("2026-02-24"),
    disabled: false,
    title: "Local Weather",
    type: "project",
    imageSrc: "/images/weather-project-cover.svg",
    description: "Local weather forecast with today, tomorrow, and useful widgets powered by Open-Meteo.",
    tags: ["weather", "forecast", "open-meteo"],
    path: "/project/6",
    external: false,
    component: LocalWeatherPage
  },
  {
    id: "7",
    creationDate: new Date("2026-05-13"),
    disabled: false,
    title: "Tip Calculator",
    type: "project",
    imageSrc: "/images/tip-calculator-project-cover.svg",
    description: "Calculate the tip and final bill total from a bill amount and tip percentage.",
    tags: ["calculator", "utility", "tips"],
    path: "/project/7",
    external: false,
    component: TipCalculatorPage
  },
  {
    id: "8",
    creationDate: new Date("2026-05-14"),
    disabled: true,
    title: "Run Pace Calculator",
    type: "project",
    imageSrc: "/images/run-pace-calculator-project-cover.svg",
    description: "Enter distance, time, or pace to calculate the missing value and project popular race times.",
    tags: ["running", "calculator", "pace"],
    path: "/project/8",
    external: false,
    component: RunPaceCalculatorPage
  },
  {
    id: "9",
    creationDate: new Date("2026-05-15"),
    disabled: true,
    title: "Classroom Noise Indicator",
    type: "project",
    imageSrc: "/images/classroom-noise-indicator-project-cover.svg",
    description: "A playful microphone-powered noise meter that helps students see when the room gets too loud.",
    tags: ["classroom", "audio", "meter"],
    path: "/project/9",
    external: false,
    component: ClassroomNoiseIndicatorPage
  }
];
