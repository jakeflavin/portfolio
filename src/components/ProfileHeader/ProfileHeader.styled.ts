import styled from 'styled-components'

/**
 * The whole profile block, on the hero's surface.
 *
 * Stacked on phones, as Instagram is. From md it becomes a grid so the bio sits in the
 * right-hand column aligned under the stats rather than wrapping back under the avatar —
 * which is how the profile header reads on desktop.
 */
export const Panel = styled.header`
  width: 100%;
  display: flex;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii?.lg ?? '16px'};
  box-shadow: ${({ theme }) => theme.shadows.raised ?? 'none'};
  /*
   * No vertical padding of its own: combined with the page gap it made the space below the
   * profile 65px against 24px everywhere else, so the rhythm broke at the top of the page.
   *
   * No border either. It was transparent under the flat pass but still occupied 1px, which
   * pushed the profile's left edge one pixel off the search field and the cards. Restore
   * a 1px divider border here if the surfaces come back.
   */
  padding: 0;
`

/**
 * Spans the page measure, sharing its left and right edges with the search field and the
 * card grid.
 *
 * The section only works when its parts are sized to fill that measure: six 64px circles
 * spread across 452px. Undersized, no alignment choice looked right - packed left the row
 * ended ragged, spread it went sparse.
 */
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;

  ${({ theme }) => theme.media.md} {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    /*
     * The avatar spans the identity and bio rows so those size to their own content, then
     * the highlights break out into a full-width row of their own beneath everything.
     */
    grid-template-areas:
      'avatar identity'
      'avatar bio'
      'highlights highlights';
    column-gap: ${({ theme }) => theme.spacing.lg};
    row-gap: ${({ theme }) => theme.spacing.sm};
    align-items: start;
    /*
     * Items stretch to their column rather than shrink-wrapping, so the identity row and
     * the bio both resolve against the block's right edge. Shrink-wrapped, the name row
     * could not push the counts out to it and the bio ended mid-column.
     */
    justify-items: stretch;
  }
`

/** Avatar beside the name and counts on narrow screens; part of the grid from md. */
export const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    display: contents;
  }
`

/**
 * The gradient ring Instagram puts around an avatar with an unwatched story. The ring is
 * the outer element; the inner circle sits inside it with a surface-coloured gap.
 */
export const AvatarRing = styled.div`
  grid-area: avatar;
  align-self: center;
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  /*
   * The ring is about 3% of the circle and the gap inside it about 2%, which is the
   * proportion the highlight rings below are built to as well. Held at fixed pixels
   * instead, the same 3px band is half again as heavy on a 64px circle as on a 96px one,
   * and the two stop reading as the same object.
   */
  padding: 2px;
  border-radius: ${({ theme }) => theme.radii?.pill ?? '999px'};
  background: ${({ theme }) => theme.gradient?.brand ?? 'none'};

  /*
   * 96px, not the 120px it was at the old measure. 120 took a third of the 452px the app
   * is now, and the bio beside it was reduced to a 308px column - which is what set how
   * many lines the typing has to reserve for its longest take-back.
   */
  ${({ theme }) => theme.media.md} {
    width: 96px;
    height: 96px;
    padding: 3px;
  }
`

export const Avatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii?.pill ?? '999px'};
  background: ${({ theme }) => theme.colors.secondary};
  border: 1.5px solid ${({ theme }) => theme.colors.surface};
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};

  svg {
    width: 44%;
    height: 44%;
    display: block;
  }

  /* Widens with the ring, so the gap stays the same share of the circle. */
  ${({ theme }) => theme.media.md} {
    border-width: 2px;
  }
`
/**
 * Fills the circle rather than fitting inside it. The photos are cropped square before
 * they ship, so the cover here only has to absorb the rounding.
 */
export const AvatarPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

export const IdentityColumn = styled.div`
  grid-area: identity;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;

  /*
   * Name left, counts right once there is width for it, so the top row resolves against
   * the same right edge as everything below rather than trailing off.
   */
  ${({ theme }) => theme.media.md} {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.lg};
    flex-wrap: wrap;
  }
`

export const Handle = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.size?.xl ?? '1.25rem'};
  font-weight: ${({ theme }) => theme.typography.weight?.normal ?? 400};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.media.md} {
    font-size: 1.5rem;
  }
`

/** Instagram's counts row: value in semibold, label in the body weight beside it. */
export const Stats = styled.dl`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    gap: ${({ theme }) => theme.spacing.lg};
  }
`

export const Stat = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};

  dt {
    order: 2;
    color: ${({ theme }) => theme.colors.muted};
  }

  dd {
    order: 1;
    margin: 0;
    font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
    color: ${({ theme }) => theme.colors.text};
  }
`

export const Bio = styled.div`
  grid-area: bio;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

/**
 * Bio hashtags. Static and muted, deliberately unlike the card hashtags below them.
 *
 * Those filter the directory and wear the gradient that says so. These describe the
 * person and do nothing when clicked, so giving them the same ink would promise something
 * they cannot do.
 */
export const BioTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
`

export const BioTag = styled.span`
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};
  color: ${({ theme }) => theme.colors.muted};
`

/**
 * All the highlights fit inline at every width — they share the row rather than scrolling,
 * so nothing is hidden off the edge on a phone.
 */
export const Highlights = styled.div`
  grid-area: highlights;
  display: flex;
  justify-self: stretch;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};

  /*
   * Scrolls rather than shrinking. The items had been sharing the row, which pushed the
   * circles below a usable tap target once there were six of them.
   */
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  /*
   * Distributed rather than given a fixed gap. Six 64px circles span 384px of the 452px
   * measure, leaving about 13px between them, so the spacing is even at the full width and
   * closes rather than overflowing below it.
   */
  ${({ theme }) => theme.media.md} {
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.lg};
    padding-top: ${({ theme }) => theme.spacing.md};
    overflow-x: visible;
  }
`

/**
 * One highlight: a ringed circle with a label under it.
 */
/**
 * Renders as an anchor for the five destinations and as a button for the appearance
 * toggle, which is the one that does something on this page rather than leaving it.
 *
 * They had all been buttons calling window.open, which a browser is entitled to treat as
 * a popup and block - and which cannot be middle-clicked, opened in a background tab, or
 * followed by a crawler. A link is a link.
 */
export const Highlight = styled.button`
  text-decoration: none;

  /*
   * Sized to its ring, not wider. A wider button centred the circle inside it, so the ring
   * sat in from the block's left edge while the button sat on it — the first thing a grid
   * overlay picks up. Labels centre under the ring and truncate, as the app does.
   */
  flex: 0 0 auto;
  width: 62px;
  min-width: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  /*
   * 64px, not the 84px this was when the measure was 732px wide. Six of those overflowed
   * the 452px the app is now, and the rail turns off its own scrolling at this width.
   */
  ${({ theme }) => theme.media.md} {
    width: 64px;
    min-width: 64px;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radii?.sm ?? '8px'};
  }
`

/**
 * The outer ring, as on a highlight: a hairline circle with a gap between it and the
 * thumbnail inside. The gap is the panel surface showing through the padding.
 */
export const HighlightRing = styled.span`
  width: 62px;
  height: 62px;
  min-width: 62px;
  flex-shrink: 0;
  /*
   * A 2px band and a 1.5px gap: the avatar's 3-and-2 on a 96px circle, taken to this one.
   * Matching those numbers in pixels instead is what made this ring look heavier than the
   * avatar's, since the same band is a bigger share of a smaller circle.
   */
  padding: 1.5px;
  border-radius: ${({ theme }) => theme.radii?.pill ?? '999px'};
  border: 2px solid ${({ theme }) => theme.colors.border};
  transition:
    transform ${({ theme }) => theme.motion?.duration?.normal ?? '0.15s'}
      ${({ theme }) => theme.motion?.easing ?? 'ease'},
    border-color ${({ theme }) => theme.motion?.duration?.normal ?? '0.15s'}
      ${({ theme }) => theme.motion?.easing ?? 'ease'};

  ${({ theme }) => theme.media.md} {
    width: 64px;
    height: 64px;
    min-width: 64px;
  }

  ${Highlight}:hover & {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.muted};
  }

  @media (prefers-reduced-motion: reduce) {
    ${Highlight}:hover & {
      transform: none;
    }
  }
`

/**
 * The thumbnail itself. The three-stop gradient reads better than the full sweep at this
 * size, and the icon sits in white since the fill is saturated.
 */
export const HighlightFill = styled.span`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii?.pill ?? '999px'};
  background: ${({ theme }) => theme.gradient?.compact ?? theme.colors.secondary};
  color: #ffffff;
  transition: filter ${({ theme }) => theme.motion?.duration?.normal ?? '0.15s'}
    ${({ theme }) => theme.motion?.easing ?? 'ease'};

  ${Highlight}:hover & {
    filter: brightness(1.08);
  }

  /*
   * Sized from the ring rather than in pixels, the way the avatar's mark is, so one number
   * covers both breakpoints. At a fixed 22px the glyph was 30% of the desktop circle and
   * 42% of the phone's — the same icon reading as two different sizes.
   */
  svg {
    display: block;
    width: 46%;
    height: 46%;
  }
`

/**
 * The appearance toggle, which wears the chip inside out.
 *
 * Every link in the row is a gradient disc inside a neutral ring. This is the reverse: the
 * gradient is the ring and the centre is the page's own surface. Colour alone could not
 * separate it — a different palette read as imported, and our own palette read as one more
 * link — so the thing that changes is the structure, which nothing else in the row does.
 *
 * It is not a new idea either: this is exactly the avatar's treatment, sitting directly
 * above it, which is what keeps it looking deliberate rather than broken.
 *
 * Which half of the sweep the ring carries previews the mode it would switch you to, cool
 * for dark and warm for light. The glyph takes the page's text colour rather than white,
 * since it now sits on the page's own ground.
 */

/**
 * The appearance toggle, which is one of the row and not a different kind of thing.
 *
 * It had been given its own construction - a gradient where the others have a ring, and a
 * plain surface where the others have a gradient - which set it apart by looking like a
 * mistake. Same ring, same ink, same everything: only the fill's gradient differs, and
 * that gradient is half of the one beside it rather than a colour from somewhere else.
 */
export const ToggleFill = styled(HighlightFill)<{ $offersLight?: boolean }>`
  && {
    background: ${({ theme, $offersLight }) =>
      ($offersLight ? theme.gradient?.toggle?.dawn : theme.gradient?.toggle?.night) ??
      theme.gradient?.compact};
  }
`

export const HighlightLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size?.xs ?? '0.75rem'};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`
