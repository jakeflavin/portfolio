import React from "react";
import type { Project } from "@/features/projects/projects";
import type { DeployedApp } from "@/features/status/useDeployStatus";
import { formatPostAge } from "@/ui/Card/card.utils";
import { NAV_ITEM_ATTRIBUTE } from "../useKeyboardNav";
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
const ListView: React.FC<ListViewProps> = ({ projects, deployed }) => (
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
);

export default ListView;
