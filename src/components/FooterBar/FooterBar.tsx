import React from 'react'
import { PROJECTS } from '@/lib/projects'
import {
  FooterContainer,
  Marquee,
  MarqueeTrack,
  MarqueeGroup,
  Text,
  Heart,
} from './FooterBar.styled'

/** Every tag in the directory, once, in the order the projects introduce them. */
function useTags() {
  return React.useMemo(() => [...new Set(PROJECTS.flatMap((project) => project.tags ?? []))], [])
}

export function FooterBar() {
  const tags = useTags()

  return (
    <FooterContainer>
      {tags.length > 0 && (
        // Decoration, and hidden from assistive technology as such: these tags do not
        // filter anything here, and the same words are on every card and in the search
        // field above. Read out, this would be forty-four of them at the end of the page.
        <Marquee aria-hidden="true">
          <MarqueeTrack>
            {[0, 1].map((copy) => (
              <MarqueeGroup key={copy}>
                {tags.map((tag) => (
                  <span key={tag}>#{tag.replace(/\s+/g, '')}</span>
                ))}
              </MarqueeGroup>
            ))}
          </MarqueeTrack>
        </Marquee>
      )}

      <Text>
        Made with <Heart>♥</Heart> by Jake Flavin
      </Text>
    </FooterContainer>
  )
}
