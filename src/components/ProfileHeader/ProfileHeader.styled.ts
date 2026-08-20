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
 * One stack at every width: the avatar beside the name and counts, the bio underneath it
 * across the full measure, then the highlights. Desktop used to run a two-column grid
 * with the bio in the avatar's right-hand column, which is a different layout to learn
 * for no gain - and it cut the bio to a 308px column, which is what decided how many
 * lines the typing had to hold open for its longest take-back.
 *
 */
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`

/** The avatar beside the name and counts. */
export const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

/**
 * The gradient ring Instagram puts around an avatar with an unwatched story. The ring is
 * the outer element; the inner circle sits inside it with a surface-coloured gap.
 */
export const AvatarRing = styled.div`
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
  ${({ theme }) => theme.query.wide} {
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
  ${({ theme }) => theme.query.wide} {
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

/** Name above counts, at every width. */
export const IdentityColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`

export const Handle = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.size?.xl ?? '1.25rem'};
  font-weight: ${({ theme }) => theme.typography.weight?.normal ?? 400};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.query.wide} {
    font-size: 1.5rem;
  }
`

/** Instagram's counts row: value in semibold, label in the body weight beside it. */
export const Stats = styled.dl`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.query.wide} {
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
 * The one link in the bio, and the only blue thing in the header.
 *
 * Blue rather than the gradient the card hashtags wear: those filter this page, and this
 * leaves it. The colour is the same one the rest of the site uses for a link, which is
 * what makes it read as one among the static text around it.
 */
export const BioLink = styled.a`
  align-self: flex-start;
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};
  color: ${({ theme }) => theme.colors.link ?? theme.colors.accent};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 2px;
    border-radius: 2px;
  }
`

/**
 * All the highlights fit inline at every width — they share the row rather than scrolling,
 * so nothing is hidden off the edge on a phone.
 */
export const Highlights = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  /*
   * Spread to the measure's own edges, so the row lines up with the search field under it
   * and the grid under that. Six 62px circles come to 452px of the 480px column and left
   * a 28px hole on the right; distributing that between them widens each gap by about 6px
   * instead. Where they do not fit there is no free space to distribute and this has no
   * effect, so the rail still just scrolls.
   */
  justify-content: space-between;

  /*
   * Scrolls rather than shrinking, at every width. The items had been sharing the row,
   * which pushed the circles below a usable tap target once there were six of them.
   *
   * Desktop used to take its own settings here - wider circles, a wider gap, and its own
   * scrolling turned off - and the three did not agree: six 64px circles with 24px
   * between them need 504px, and the block is 472px wide, so the row simply ran past its
   * own right edge with no way to reach the end of it. One rail, one size.
   */
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
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

/**
 * EXPERIMENT - GitHub and LinkedIn only.
 *
 * Inverts the treatment of the rest of the row: the fill is the service's own brand colour
 * and the mark on it is painted with our gradient, rather than a gradient fill under a
 * white mark. Remove this component, `BRAND_FILL` in the component file, and the
 * `<StoryGradient />` defs to put the row back.
 *
 * An SVG cannot be painted by a CSS background, so the gradient has to exist as an SVG
 * paint server and be referenced by `fill`. CSS beats the presentation attribute the icon
 * carries, so the rule below is all that is needed to redirect it.
 */
export const BrandFill = styled(HighlightFill)<{ $brand: string }>`
  && {
    background: ${({ $brand }) => $brand};
  }

  svg {
    fill: url(#story-gradient);
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
