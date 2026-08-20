import React from 'react'
import { ProjectActions } from '@/components/ProjectActions'
import {
  CardWrapper,
  PostHeader,
  HeaderTitle,
  Media,
  CardImage,
  Caption,
  Description,
  HashTags,
  HashTag,
  Meta,
  Timestamp,
  MetaDot,
  Build,
  Pinned,
} from './Card.styled'
import { formatPostAge } from './card.utils'
import { NAV_ITEM_ATTRIBUTE } from '@/hooks/useKeyboardNav'

export type CardType = 'project'

export interface CardProps {
  /** Card title */
  title: string
  /** Card type; retained for the directory's data shape */
  type?: CardType
  /** Image URL; shown as the post media */
  imageSrc: string
  /** Description shown as the caption, clamped to two lines until expanded */
  description: string
  /** Tags rendered as hashtags under the caption */
  tags?: string[]
  /** Destination for the card. Omit to render a non-interactive card. */
  href?: string
  /** Renders the card as unavailable and drops the links */
  disabled?: boolean
  /** Shown as the post age */
  date?: Date
  /** `owner/name` on GitHub, linked from the action row */
  repo?: string
  /** Called with a tag when its chip is clicked */
  onTagClick?: (tag: string) => void
  /** Release tag this slug shipped from, per the deploy manifest */
  build?: string
  /** Whether that release is pinned in apps.json rather than tracking the latest */
  pinned?: boolean
}

export function Card({
  title,
  imageSrc,
  description,
  tags = [],
  href,
  disabled = false,
  date,
  repo,
  onTagClick,
  build,
  pinned = false,
}: CardProps) {
  const isLink = Boolean(href) && !disabled
  const age = disabled ? 'Coming soon' : date ? formatPostAge(date) : null

  return (
    <CardWrapper $disabled={disabled}>
      <PostHeader>
        <HeaderTitle
          as={isLink ? 'a' : 'span'}
          href={isLink ? href : undefined}
          target={isLink ? '_blank' : undefined}
          rel={isLink ? 'noopener noreferrer' : undefined}
          {...(isLink ? { [NAV_ITEM_ATTRIBUTE]: '' } : {})}
        >
          {title}
        </HeaderTitle>
      </PostHeader>

      <Media
        as={isLink ? 'a' : 'div'}
        href={isLink ? href : undefined}
        target={isLink ? '_blank' : undefined}
        rel={isLink ? 'noopener noreferrer' : undefined}
        tabIndex={-1}
      >
        <CardImage src={imageSrc} alt={`${title} preview`} />
      </Media>

      <ProjectActions title={title} href={isLink ? href : undefined} repo={repo} />

      <Caption>
        <Description>{description}</Description>
        {tags.length > 0 && (
          <HashTags>
            {tags.map((tag) => (
              <HashTag
                key={tag}
                type="button"
                onClick={() => onTagClick?.(tag)}
                aria-label={`Filter by ${tag}`}
              >
                #{tag.replace(/\s+/g, '')}
              </HashTag>
            ))}
          </HashTags>
        )}
        {(age || build) && (
          <Meta>
            {age && <Timestamp>{age}</Timestamp>}
            {age && build && <MetaDot aria-hidden="true">·</MetaDot>}
            {build && <Build title={`Deployed from release ${build}`}>{build}</Build>}
            {build && pinned && <Pinned title="Held at this release">pinned</Pinned>}
          </Meta>
        )}
      </Caption>
    </CardWrapper>
  )
}
