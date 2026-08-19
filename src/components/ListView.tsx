import React from "react";
import type { Project } from "@/lib/projects";
import type { DeployedApp } from "@/hooks/useDeployStatus";
import { formatPostAge } from "@/components/Card/card.utils";
import { NAV_ITEM_ATTRIBUTE } from "@/hooks/useKeyboardNav";
import {
  Rows,
  Row,
  RowThumb,
  RowMain,
  RowTitle,
  RowDescription,
  RowMeta,
  RowBuild
} from "./Views.styled";

export interface ListViewProps {
  projects: Project[];
  deployed: Map<string, DeployedApp>;
}

/** One row per tool, for scanning names, dates and builds. */
export function ListView({ projects, deployed }: ListViewProps) {
  return (
  <Rows>
    {projects.map((project) => {
      const build = deployed.get(project.slug)?.tag;
      return (
        <Row
          key={project.id}
          href={project.disabled ? undefined : project.path}
          $disabled={project.disabled}
          aria-label={project.title}
          {...{ [NAV_ITEM_ATTRIBUTE]: "" }}
        >
          <RowThumb src={project.imageSrc} alt="" loading="lazy" />
          <RowMain>
            <RowTitle>{project.title}</RowTitle>
            <RowDescription>{project.description}</RowDescription>
          </RowMain>
          <RowMeta>
            {build && <RowBuild>{build}</RowBuild>}
            <span>{formatPostAge(project.creationDate)}</span>
          </RowMeta>
        </Row>
      );
    })}
  </Rows>
  )
}
