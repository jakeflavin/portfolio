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
  position: relative;
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

/**
 * The caption's rhythm is 12px between one block of ink and the next, and every text block
 * in it is trimmed to its cap and baseline so that number is the one you actually see.
 *
 * Untrimmed, each block carries about 5px of leading above and below, so the gaps written
 * here and the gaps on screen were different numbers - 8px of padding reading as 14, 16px
 * reading as 16 because an icon has no leading. That is what made the caption's spacing
 * look uneven while every value in the file looked deliberate.
 */
/**
 * The card's click target, stretched over the whole of it.
 *
 * The title and the cover were the only links on a card, which left the caption dead:
 * clicking the description, the tag row's empty half, or the date did nothing. A card
 * reads as one object, so all of it opens the app.
 *
 * It sits under everything at z-index 0, and the caption's own controls - the tag
 * filters, the action icons, the "more" toggle - sit above it and keep working.
 */
export const CardLink = styled.a`
  position: absolute;
  inset: 0;
  z-index: 0;

  &:focus-visible {
    outline: none;
  }
`

export const PostHeader = styled.header`
  position: relative;
  z-index: 1;
  pointer-events: none;
  display: flex;

  a,
  button {
    pointer-events: auto;
  }

  align-items: baseline;
  gap: 5px;
  padding: 0 0 12px;
`

/** The title slot: semibold, and a link, where a post carries its username. */
export const HeaderTitle = styled.a`
  text-box: trim-both cap alphabetic;
  min-width: 0;
  font-size: ${({ theme }) => theme.typography.size?.lg ?? '0.9375rem'};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  white-space: nowrap;
  /*
   * Clipped with a margin rather than hidden.
   *
   * The box above is trimmed to the baseline, so a descender is drawn outside it by
   * design, and hidden cuts exactly that off: Runify lost the tail of its y in every
   * view. Clip still gives the ellipsis a box to work against, and the margin lets the
   * ink that belongs below the baseline paint.
   */
  overflow: clip;
  overflow-clip-margin: 0.3em;
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

/** Above the stretched link, so the icons keep their own clicks. */
export const CardActions = styled.div`
  position: relative;
  z-index: 1;
`

export const Caption = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  /* Text falls through to the card's link; the controls inside opt back in. */
  pointer-events: none;

  a,
  button {
    pointer-events: auto;
  }
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

  /* The paragraph, not the wrapper: the wrapper holds no text of its own to trim. */
  > p {
    text-box: trim-both cap alphabetic;
  }
`

/**
 * The gradient is painted on the row and clipped to its text, so the tags share one sweep
 * rather than each getting its own slice of it.
 */
export const HashTags = styled(TagRow)`
  text-box: trim-both cap alphabetic;
`

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
  text-box: trim-both cap alphabetic;
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
