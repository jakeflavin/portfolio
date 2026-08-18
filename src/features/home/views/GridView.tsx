import React from "react";
import type { Project } from "@/features/projects/projects";
import { NAV_ITEM_ATTRIBUTE } from "../useKeyboardNav";
import { Tiles, Tile, TileImage, TileLabel } from "./Views.styled";

export interface GridViewProps {
  projects: Project[];
}

/** Covers only. The screenshots are the most identifying thing each app has. */
const GridView: React.FC<GridViewProps> = ({ projects }) => (
  <Tiles>
    {projects.map((project) => (
      <Tile
        key={project.id}
        href={project.disabled ? undefined : project.path}
        $disabled={project.disabled}
        aria-label={project.title}
        title={project.title}
        {...{ [NAV_ITEM_ATTRIBUTE]: "" }}
      >
        <TileImage src={project.imageSrc} alt="" loading="lazy" />
        <TileLabel aria-hidden="true">{project.title}</TileLabel>
      </Tile>
    ))}
  </Tiles>
);

export default GridView;
