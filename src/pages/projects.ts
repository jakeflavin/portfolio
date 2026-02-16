import React from "react";
import type { CardType } from "../components/core/Card";
import ProjectDetailPage from "./projects/ProjectDetailPage";

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
    title: "My Project",
    type: "project",
    imageSrc: "/images/mockup-example-1.png",
    description: "A short description of the project. I'll use this to describe the project.",
    tags: ["React", "TypeScript", "Vite"],
    path: "/project/1",
    component: ProjectDetailPage
  }
];
