import React from 'react'
import { Moon, Sun, Newspaper } from 'lucide-react'
import { TypeWriter } from '@/components/TypeWriter'
import { BIO_SCRIPT } from './bio'
import { BrandIcon, type BrandName } from '@/components/BrandIcon'
import { CrownMark } from './CrownMark'
import { PROJECTS } from '@/lib/projects'
import {
  Panel,
  Content,
  Identity,
  AvatarRing,
  Avatar,
  IdentityColumn,
  Handle,
  Stats,
  Stat,
  Bio,
  BioTags,
  BioTag,
  Highlights,
  Highlight,
  HighlightRing,
  HighlightFill,
  ToggleFill,
  HighlightLabel,
} from './ProfileHeader.styled'

export interface ProfileHeaderProps {
  isDarkMode?: boolean
  onToggleDarkMode?: () => void
}

/**
 * Part of the bio, not a filter. These describe the person rather than indexing the
 * directory, so they are static text — the card hashtags are the ones that search.
 */
const BIO_TAGS = ['developer', 'react', 'java', 'runner', 'girldad']

const ICON_SIZE = 22

/**
 * Holds an icon rather than a brand name, since not every destination has a brand mark —
 * the blog is a plain lucide glyph alongside the three logos.
 */
const LINKS: { key: string; href: string; label: string; icon: React.ReactNode }[] = [
  {
    key: 'threads',
    href: 'https://www.threads.com/@jakeflavin',
    label: 'Threads',
    icon: <BrandIcon name={'threads' as BrandName} size={ICON_SIZE} />,
  },
  {
    key: 'linkedin',
    href: 'https://linkedin.com/in/jakeflavin',
    label: 'LinkedIn',
    icon: <BrandIcon name={'linkedin' as BrandName} size={ICON_SIZE} />,
  },
  {
    key: 'github',
    href: 'https://github.com/jakeflavin',
    label: 'GitHub',
    icon: <BrandIcon name={'github' as BrandName} size={ICON_SIZE} />,
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/jakeflavin',
    label: 'Instagram',
    icon: <BrandIcon name={'instagram' as BrandName} size={ICON_SIZE} />,
  },
  {
    key: 'blog',
    href: 'https://jakeflavin.com',
    label: 'Blog',
    icon: <Newspaper size={ICON_SIZE} />,
  },
]

/**
 * The vanity stat. Not derived from anything — it is the "followers" slot, and the joke is
 * that the ideas outnumber the shipped tools by three orders of magnitude.
 */
const IDEAS = 2319

/** The counts row. Tools and tags are real manifest data; ideas is the vanity number. */
function useStats() {
  const tags = new Set(PROJECTS.flatMap((project) => project.tags ?? []))
  return [
    { label: PROJECTS.length === 1 ? 'tool' : 'tools', value: PROJECTS.length },
    { label: tags.size === 1 ? 'tag' : 'tags', value: tags.size },
    // Grouped, as Instagram formats its counts — with the reader's own separator,
    // which is a space in fr and a period in de.
    { label: 'ideas', value: IDEAS.toLocaleString() },
  ]
}

export function ProfileHeader({ isDarkMode = false, onToggleDarkMode }: ProfileHeaderProps) {
  const stats = useStats()

  return (
    <Panel>
      <Content>
        <Identity>
          <AvatarRing>
            <Avatar>
              <CrownMark />
            </Avatar>
          </AvatarRing>

          <IdentityColumn>
            <Handle>Jake&apos;s Tools</Handle>
            <Stats>
              {stats.map(({ label, value }) => (
                <Stat key={label}>
                  <dd>{value}</dd>
                  <dt>{label}</dt>
                </Stat>
              ))}
            </Stats>
          </IdentityColumn>
        </Identity>

        <Bio>
          <TypeWriter
            script={BIO_SCRIPT}
            typingSpeed={80}
            deletingSpeed={50}
            restartDelay={60000}
          />
          <BioTags>
            {BIO_TAGS.map((tag) => (
              <BioTag key={tag}>#{tag}</BioTag>
            ))}
          </BioTags>
        </Bio>

        <Highlights>
          {/* First and pinned, so it stays visible when the rail scrolls. */}
          <Highlight type="button" onClick={onToggleDarkMode} aria-label="Toggle dark mode">
            <HighlightRing>
              <ToggleFill $offersLight={isDarkMode}>
                {isDarkMode ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
              </ToggleFill>
            </HighlightRing>
            <HighlightLabel>{isDarkMode ? 'Light' : 'Dark'}</HighlightLabel>
          </Highlight>

          {LINKS.map(({ key, href, label, icon }) => (
            <Highlight
              key={key}
              type="button"
              onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
              aria-label={`Open ${label}`}
            >
              <HighlightRing>
                <HighlightFill>{icon}</HighlightFill>
              </HighlightRing>
              <HighlightLabel>{label}</HighlightLabel>
            </Highlight>
          ))}
        </Highlights>
      </Content>
    </Panel>
  )
}
