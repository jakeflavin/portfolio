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
  border: 1px solid ${({ theme }) => theme.colors.divider};
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
   * Full-bleed on phones: the grid is a single column there, so the media breaks out of
   * the container's gutter to meet the screen edges. Reset at sm, where the grid splits
   * into columns and a bleed would run cards into each other.
   */
  width: calc(100% + ${({ theme }) => theme.spacing.md} * 2);
  margin-left: -${({ theme }) => theme.spacing.md};
  margin-right: -${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.sm} {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
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

export const Description = styled.p<{ $clamped?: boolean }>`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.muted};
  text-wrap: pretty;

  ${({ $clamped }) =>
    $clamped &&
    `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`

/** Holds the clamped text so the control can sit on its last line. */
export const DescriptionWrap = styled.div`
  position: relative;
`

/**
 * While clamped this sits at the end of the second line rather than below the text, which
 * is how a truncated caption reads. It is overlaid on the clamp, so it carries the card
 * surface plus a fade wide enough to clear the word running underneath it — a narrow one
 * left a part-word butted against the ellipsis, which read as a clipping bug rather than
 * as a truncated caption.
 */
export const MoreButton = styled.button<{ $inline?: boolean }>`
  padding: 0;
  border: none;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};
  line-height: 1.45;
  /* Full-strength and medium weight, so it stands out as a control against the muted
     description rather than reading as more of the same text. */
  font-weight: ${({ theme }) => theme.typography.weight?.medium ?? 500};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  background: none;

  ${({ theme, $inline }) =>
    $inline
      ? `
    position: absolute;
    right: 0;
    bottom: 0;
    padding-left: 44px;
    background: linear-gradient(
      to right,
      transparent 0,
      ${theme.colors.surface} 40px,
      ${theme.colors.surface} 100%
    );
  `
      : `
    display: block;
    margin-top: 2px;
  `}

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 2px;
    border-radius: 2px;
  }
`

/**
 * The gradient is painted on the row and clipped to its text, so the tags share one sweep
 * rather than each getting its own slice of it.
 */
export const HashTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 6px;
  line-height: 1.4;
  background: ${({ theme }) => theme.gradient?.text ?? 'none'};
  background-clip: text;
  -webkit-background-clip: text;
`

/**
 * Plain hashtag text, not blue. They filter the directory, so they stay interactive, but
 * the link colour made them read as navigation to somewhere else.
 */
export const HashTag = styled.button`
  padding: 0;
  background: none;
  border: none;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.size?.sm ?? '0.8125rem'};
  cursor: pointer;
  word-break: break-word;
  /*
   * The declared colour is the fallback and the transparent fill is the gradient path: any
   * browser lacking -webkit-text-fill-color also lacks the background-clip this depends on,
   * so it simply keeps the muted text.
   */
  color: ${({ theme }) => theme.colors.muted};
  -webkit-text-fill-color: transparent;
  transition: opacity ${({ theme }) => theme.motion?.duration?.normal ?? '0.15s'}
    ${({ theme }) => theme.motion?.easing ?? 'ease'};

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 2px;
    border-radius: 2px;
  }
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
