import { TagRow, Tag } from '@/components/Tag/Tag.styled'
import { ClampedText } from '@/components/ClampedText'
import styled from 'styled-components'

interface CardWrapperProps {
  $disabled?: boolean
}

/**
 * An Instagram post: header, tall full-bleed media, an action row, then the caption.
 *
 * The card is not one big anchor — a post never is. The title, the media and each action
 * are their own controls, which is both how Instagram behaves and the only valid way to
 * nest buttons and links inside it.
 */
export const CardWrapper = styled.article<CardWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  /*
   * No border. It was transparent under the flat pass but still took its 1px, which held
   * the card's contents one pixel inside the measure that the search field, the grid, the
   * list and the marquee all sit flush against. Invisible while the media bled past the
   * gutter; not once it stopped. Put a 1px solid divider border back here if the
   * outlines come back.
   */
  box-shadow: ${({ theme }) => theme.shadows.raised ?? 'none'};
  transition:
    border-color ${({ theme }) => theme.motion?.duration?.normal ?? '0.15s'}
      ${({ theme }) => theme.motion?.easing ?? 'ease'},
    box-shadow ${({ theme }) => theme.motion?.duration?.slow ?? '0.25s'}
      ${({ theme }) => theme.motion?.easing ?? 'ease'},
    transform ${({ theme }) => theme.motion?.duration?.slow ?? '0.25s'}
      ${({ theme }) => theme.motion?.easing ?? 'ease'};

  /* Nothing is outlined, so the lift and the media scrim carry the hover on their own. */
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.hover ?? 'none'};
    transform: translateY(-3px);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    opacity: 0.5;

    &:hover {
      transform: none;
      box-shadow: ${'${({ theme }) => theme.shadows.raised}'};
    }
  `}
`

export const PostHeader = styled.header`
  display: flex;
  align-items: baseline;
  gap: 5px;
  padding: 0 0 ${({ theme }) => theme.spacing.sm};
`

/** The title slot: semibold, and a link, where a post carries its username. */
export const HeaderTitle = styled.a`
  min-width: 0;
  font-size: ${({ theme }) => theme.typography.size?.lg ?? '0.9375rem'};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`

/** Portrait media is the single most recognisable thing about a post. */
export const Media = styled.a`
  display: block;
  aspect-ratio: 1 / 1;
  overflow: hidden;

  /*
   * Held inside the gutter, like everything else.
   *
   * It used to break out to the screen edges on a phone, from when the feed was the only
   * view and the page had little else with an edge. It now shares the column with a grid,
   * a list, a search field and a marquee, all of which stop at the gutter - so the one
   * element reaching past them read as a mistake rather than as emphasis.
   */
  width: 100%;
  background: ${({ theme }) => theme.colors.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: #000000;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.motion?.duration?.normal ?? '0.15s'}
      ${({ theme }) => theme.motion?.easing ?? 'ease'};
  }

  &:hover::after {
    opacity: 0.04;
  }
`

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  /* Covers are captured at 1:1 by scripts/capture-cover.mjs, so this fills exactly. */
  object-fit: cover;
  display: block;
  filter: ${({ theme }) => theme.img.brightness};
`

export const Caption = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 0;
`

/**
 * The caption's description, cut to two lines with a control for the rest.
 *
 * The clamp, the measurement and the control are the shared component's; what belongs to
 * the card is how the text is set and the colour the inline control fades to, which has
 * to be the card's own surface for the fade to be invisible.
 */
export const Description = styled(ClampedText).attrs(({ theme }) => ({
  lines: 2,
  fade: theme.colors.surface,
}))`
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};
  color: ${({ theme }) => theme.colors.muted};
`

/**
 * The gradient is painted on the row and clipped to its text, so the tags share one sweep
 * rather than each getting its own slice of it.
 */
export const HashTags = styled(TagRow)``

export const HashTag = styled(Tag)`
  font-size: ${({ theme }) => theme.typography.size?.sm ?? '0.8125rem'};
`

/**
 * Post age and build. Deliberately the quietest thing in the caption.
 *
 * The build joins the line that already existed rather than becoming a row of its own:
 * the caption's rhythm — description, tags, one faint line — is what makes the card read
 * as a post, and a second faint row underneath breaks it.
 */
export const Meta = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 2px;
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.colors.muted};
  opacity: 0.8;
`

export const Timestamp = styled.time``

/** The separator between age and build, hidden from assistive tech as pure decoration. */
export const MetaDot = styled.span`
  opacity: 0.6;
`

/**
 * The release tag this slug actually shipped. Tabular figures so the build numbers line
 * up between cards in the grid rather than jittering by digit width.
 */
export const Build = styled.span`
  font-variant-numeric: tabular-nums;
`

/** Marks a slug held at a fixed release instead of tracking the latest. */
export const Pinned = styled.span`
  color: ${({ theme }) => theme.colors.link};
`
