import React from "react";
import type { Project } from "@/features/projects/projects";
import { Grid, Tile, TileImage, Overlay, OverlayTitle, OverlayMeta } from "./GridView.styled";

export interface GridViewProps {
  projects: Project[];
}

const GridView: React.FC<GridViewProps> = ({ projects }) => (
  <Grid>
    {projects.map((project) => {
      const isLink = !project.disabled;

      return (
        <Tile
          key={project.id}
          as={isLink ? "a" : "div"}
          href={isLink ? project.path : undefined}
          $disabled={project.disabled}
          aria-label={isLink ? `Open ${project.title}` : undefined}
        >
          <TileImage src={project.imageSrc} alt={`${project.title} preview`} />
          <Overlay>
            <OverlayTitle>{project.title}</OverlayTitle>
            <OverlayMeta>
              {project.disabled ? "coming soon" : project.tags?.slice(0, 2).join(" · ")}
            </OverlayMeta>
          </Overlay>
        </Tile>
      );
    })}
  </Grid>
);

export default GridView;
