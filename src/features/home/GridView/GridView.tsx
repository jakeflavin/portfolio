import React from "react";
import type { Project } from "@/features/projects/projects";
import { SealCheckIcon } from "@phosphor-icons/react";
import { Grid, Tile, TileImage, Overlay, OverlayTitle, OverlayMeta, TileBadge } from "./GridView.styled";

export interface GridViewProps {
  projects: Project[];
}

/**
 * Only feature a tile once there are enough others for the break in rhythm to read as
 * deliberate. Below that it just looks like one tile rendered wrong.
 */
const FEATURE_THRESHOLD = 5;

const GridView: React.FC<GridViewProps> = ({ projects }) => (
  <Grid>
    {projects.map((project, index) => {
      const isLink = !project.disabled;
      const featured = index === 0 && projects.length >= FEATURE_THRESHOLD;

      return (
        <Tile
          key={project.id}
          as={isLink ? "a" : "div"}
          href={isLink ? project.path : undefined}
          $disabled={project.disabled}
          $featured={featured}
          aria-label={isLink ? `Open ${project.title}` : undefined}
        >
          <TileImage src={project.imageSrc} alt={`${project.title} preview`} />
          {isLink && (
            <TileBadge title="Live" aria-label="Live">
              <SealCheckIcon size={16} weight="fill" />
            </TileBadge>
          )}
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
