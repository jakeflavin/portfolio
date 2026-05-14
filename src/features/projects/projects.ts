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
import { PROJECT_RECORDS } from "./projectRecords";

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

const PROJECT_COMPONENTS: Record<string, React.ComponentType<{ project: Project }>> = {
  "1": RunningRouteEstimatorPage,
  "2": CountDownPage,
  "3": CoolLinksPage,
  "4": TicTacToePage,
  "5": MadlibsPage,
  "6": LocalWeatherPage,
  "7": TipCalculatorPage,
  "8": RunPaceCalculatorPage,
  "9": ClassroomNoiseIndicatorPage
};

export const PROJECTS: Project[] = PROJECT_RECORDS.map((project) => ({
  ...project,
  creationDate: new Date(project.creationDate),
  type: project.type as CardType,
  component: PROJECT_COMPONENTS[project.id]
}));
