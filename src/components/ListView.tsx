import React from 'react'
import type { Project } from '@/lib/projects'
import type { DeployedApp } from '@/hooks/useDeployStatus'
import { formatPostAge } from '@/components/Card/card.utils'
import { NAV_ITEM_ATTRIBUTE } from '@/hooks/useKeyboardNav'
import { ProjectActions } from '@/components/ProjectActions'
import {
  Rows,
  Row,
  RowLink,
  RowThumb,
  RowMain,
  RowTitle,
  RowDescription,
  RowFooter,
  RowTags,
  RowTag,
  RowMeta,
  RowActions,
  RowBuild,
} from './Views.styled'

export interface ListViewProps {
  projects: Project[]
  deployed: Map<string, DeployedApp>
  onTagClick?: (tag: string) => void
}

/** One row per tool, for scanning names, dates and builds. */
export function ListView({ projects, deployed, onTagClick }: ListViewProps) {
  return (
    <Rows>
      {projects.map((project) => {
        const isLink = !project.disabled
        const build = deployed.get(project.slug)?.tag
        return (
          <Row key={project.id} $disabled={project.disabled}>
            {isLink && (
              <RowLink
                href={project.path}
                aria-label={project.title}
                {...{ [NAV_ITEM_ATTRIBUTE]: '' }}
              />
            )}

            <RowThumb src={project.imageSrc} alt="" loading="lazy" />

            <RowMain>
              <RowTitle>{project.title}</RowTitle>
              <RowDescription>{project.description}</RowDescription>
              <RowFooter>
                <RowTags>
                  {(project.tags ?? []).map((tag) => (
                    <RowTag
                      key={tag}
                      type="button"
                      onClick={() => onTagClick?.(tag)}
                      aria-label={`Filter by ${tag}`}
                    >
                      #{tag.replace(/\s+/g, '')}
                    </RowTag>
                  ))}
                </RowTags>

                <RowActions>
                  <ProjectActions
                    title={project.title}
                    href={isLink ? project.path : undefined}
                    repo={project.repo}
                  />
                </RowActions>
              </RowFooter>
            </RowMain>

            <RowMeta>
              {build && <RowBuild>{build}</RowBuild>}
              <span>{formatPostAge(project.creationDate)}</span>
            </RowMeta>
          </Row>
        )
      })}
    </Rows>
  )
}
