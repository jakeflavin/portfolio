import React from "react";
import type { Project } from "../projects";

interface ProjectDetailPageProps {
  project: Project;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project }) => {
  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
    </div>
  );
};

export default ProjectDetailPage;
