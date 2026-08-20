import React, { useState } from 'react'
import { useTheme, type DefaultTheme } from 'styled-components'
import { Moon, Sun, Newspaper } from 'lucide-react'
import { TypeWriter } from '@/components/TypeWriter'
import { BIO_SCRIPT } from './bio'
import { BrandIcon, type BrandName } from '@/components/BrandIcon'
import { CrownMark } from './CrownMark'
import { pickAvatar } from './avatars'
import { PROJECTS } from '@/lib/projects'
import {
  Panel,
  Content,
  Identity,
  AvatarRing,
  Avatar,
  AvatarPhoto,
  IdentityColumn,
  Handle,
  Stats,
  Stat,
  Bio,
  BioTags,
  BioTag,
  BioLink,
  Highlights,
  Highlight,
  HighlightRing,
  HighlightFill,
  BrandFill,
  BrandRing,
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

/** Shown without its scheme, the way a profile prints a link. */
const SUPPORT_URL = 'https://ko-fi.com/jakeflavin'

/**
 * EXPERIMENT. The five destinations: each one's own colour on the fill, a white mark on
 * it, and our gradient out on the ring.
 *
 * The appearance toggle takes the fill but keeps the plain ring, which is what tells the
 * row apart: a gradient ring means this circle leaves the page.
 *
 * Emptying this puts the row back to one treatment.
 */
const brandFills = (theme: DefaultTheme): Record<string, string> => ({
  github: '#181717',
  linkedin: '#0A66C2',
  threads: '#000000',
  /* Their single-colour mark. White sits on it at 4:1, which a glyph wants 3 for. */
  instagram: '#E4405F',
  /*
   * Not a brand colour, because the blog is not someone else's platform. It takes the
   * middle of our own sweep, which means it is ours in whichever theme is showing.
   */
  blog: theme.gradient?.stops?.[2] ?? theme.colors.accent,
})

/**
 * The appearance toggle's fill, which previews the mode it would switch you to: the ember
 * at the warm end of our sweep when it is offering daylight, the violet near the cool end
 * when it is offering dark.
 *
 * Two stops in from the ends the blog sits between, so no two circles in the row are the
 * same colour. White holds on both - 5.2 on either in the light theme, 5.3 and 7.9 in the
 * dark.
 */
const toggleFill = (theme: DefaultTheme, offersLight: boolean) => {
  const stops = theme.gradient?.stops ?? []
  return (offersLight ? stops[4] : stops[1]) ?? theme.colors.accent
}

const ICON_SIZE = 22

/**
 * The outbound links, in the order they earn attention: the work first, then the person,
 * then the places that are mostly photographs.
 *
 * Holds an icon rather than a brand name, since not every destination has a brand mark —
 * the blog is a plain lucide glyph alongside the four logos.
 */
const LINKS: { key: string; href: string; label: string; icon: React.ReactNode }[] = [
  {
    key: 'github',
    href: 'https://github.com/jakeflavin',
    label: 'GitHub',
    icon: <BrandIcon name={'github' as BrandName} size={ICON_SIZE} />,
  },
  {
    key: 'linkedin',
    href: 'https://linkedin.com/in/jakeflavin',
    label: 'LinkedIn',
    icon: <BrandIcon name={'linkedin' as BrandName} size={ICON_SIZE} />,
  },
  {
    key: 'blog',
    href: 'https://jakeflavin.com',
    label: 'Blog',
    icon: <Newspaper size={ICON_SIZE} />,
  },
  {
    key: 'threads',
    href: 'https://www.threads.com/@jakeflavin',
    label: 'Threads',
    icon: <BrandIcon name={'threads' as BrandName} size={ICON_SIZE} />,
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/jakeflavin',
    label: 'Instagram',
    icon: <BrandIcon name={'instagram' as BrandName} size={ICON_SIZE} />,
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

  // Once per mount, not per render: re-picking on every render would swap the face
  // whenever anything else on the page changed.
  const [avatar] = useState(pickAvatar)

  const theme = useTheme()
  const fills = brandFills(theme)

  return (
    <Panel>
      <Content>
        <Identity>
          <AvatarRing>
            <Avatar>
              {avatar ? <AvatarPhoto src={avatar.src} alt={avatar.alt} /> : <CrownMark />}
            </Avatar>
          </AvatarRing>

          <IdentityColumn>
            <Handle>Jake&apos;s Portfolio</Handle>
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

          <BioLink href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
            {SUPPORT_URL.replace(/^https:\/\//, '')}
          </BioLink>
        </Bio>

        <Highlights>
          {/* First and pinned, so it stays visible when the rail scrolls. */}
          <Highlight type="button" onClick={onToggleDarkMode} aria-label="Toggle dark mode">
            {/* The plain ring, not the gradient one the destinations wear. */}
            <HighlightRing>
              <BrandFill $brand={toggleFill(theme, isDarkMode)}>
                {isDarkMode ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
              </BrandFill>
            </HighlightRing>
            <HighlightLabel>{isDarkMode ? 'Light' : 'Dark'}</HighlightLabel>
          </Highlight>

          {LINKS.map(({ key, href, label, icon }) => (
            <Highlight
              key={key}
              as="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${label}`}
            >
              {fills[key] ? (
                <BrandRing>
                  <BrandFill $brand={fills[key]}>{icon}</BrandFill>
                </BrandRing>
              ) : (
                <HighlightRing>
                  <HighlightFill>{icon}</HighlightFill>
                </HighlightRing>
              )}
              <HighlightLabel>{label}</HighlightLabel>
            </Highlight>
          ))}
        </Highlights>
      </Content>
    </Panel>
  )
}
