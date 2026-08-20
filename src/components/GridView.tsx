import React from 'react'
import type { Project } from '@/lib/projects'
import type { DeployedApp } from '@/hooks/useDeployStatus'
import { NAV_ITEM_ATTRIBUTE } from '@/hooks/useKeyboardNav'
import { ProjectActions, OnImage } from '@/components/ProjectActions'
import { formatPostAge } from '@/components/Card/card.utils'
import {
  Tiles,
  Tile,
  TileLink,
  TileImage,
  TilePanel,
  TilePanelBody,
  TileTitle,
  TileActions,
  TileDescription,
  TileTags,
  TileTag,
  TileMeta,
} from './Views.styled'

export interface GridViewProps {
  projects: Project[]
  deployed?: Map<string, DeployedApp>
  onTagClick?: (tag: string) => void
}

/**
 * Covers, with everything the card says revealed over them on hover.
 *
 * The screenshots are the most identifying thing each app has, so they stay the whole tile
 * until you ask for more. What appears then is the card's own content in the card's own
 * order, so moving between the two views is not relearning anything.
 */
export function GridView({ projects, deployed, onTagClick }: GridViewProps) {
  return (
    <Tiles>
      {projects.map((project) => {
        const isLink = !project.disabled
        const age = project.disabled ? 'Coming soon' : formatPostAge(project.creationDate)
        const build = deployed?.get(project.slug)?.tag

        return (
          <Tile key={project.id} $disabled={project.disabled}>
            <TileLink
              href={isLink ? project.path : undefined}
              aria-label={project.title}
              {...(isLink ? { [NAV_ITEM_ATTRIBUTE]: '' } : {})}
            >
              <TileImage src={project.imageSrc} alt="" loading="lazy" />
            </TileLink>

            <TilePanel>
              <TilePanelBody>
                <TileTitle>{project.title}</TileTitle>

                <TileActions>
                  <OnImage>
                    <ProjectActions
                      title={project.title}
                      href={isLink ? project.path : undefined}
                      repo={project.repo}
                    />
                  </OnImage>
                </TileActions>

                <TileDescription>{project.description}</TileDescription>

                {project.tags && project.tags.length > 0 && (
                  <TileTags>
                    {project.tags.map((tag) => (
                      <TileTag
                        key={tag}
                        type="button"
                        onClick={() => onTagClick?.(tag)}
                        aria-label={`Filter by ${tag}`}
                      >
                        #{tag.replace(/\s+/g, '')}
                      </TileTag>
                    ))}
                  </TileTags>
                )}

                <TileMeta>
                  {age}
                  {build && <span aria-hidden="true">·</span>}
                  {build && <span>{build}</span>}
                </TileMeta>
              </TilePanelBody>
            </TilePanel>
          </Tile>
        )
      })}
    </Tiles>
  )
}
