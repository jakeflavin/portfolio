import { styled } from 'styled-components'
import { TagRow, Tag } from '@/components/Tag/Tag.styled'
import { ClampedText } from '@/components/ClampedText'

/**
 * Grid: covers only, at the density the covers were captured for.
 *
 * The screenshots are the one thing every app has that is genuinely its own, so this view
 * drops everything else and lets them do the identifying. Titles stay in the accessible
 * name and the tooltip rather than on the tile.
 */
/** Three across, at every width. Two on a phone read as a list of large squares. */
export const Tiles = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
`

/**
 * A tile is a container rather than a link now, because the panel it reveals carries its
 * own links and buttons and an anchor may not hold those. The cover keeps the whole-tile
 * click target; everything interactive in the panel is a sibling of it, not a child.
 */
export const Tile = styled.article<{ $disabled?: boolean }>`
  /*
   * A container, so the hover panel can decide what it has room for from the tile's own
   * width. The viewport is the wrong thing to ask: the grid is three across at every
   * width and the app's measure is fixed, so a tile is around 149px on a laptop and 112px
   * on a phone. Both are too narrow for a paragraph, and only one of them is a phone.
   */
  container-type: inline-size;
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.secondary};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`

/** The cover's own link: the tile-sized target, sitting under the panel. */
export const TileLink = styled.a`
  position: absolute;
  inset: 0;
  display: block;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: -2px;
  }
`

export const TileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

/**
 * Everything the card shows, over the cover, on hover.
 *
 * Also on focus-within, and that case is not decoration: without it the view cannot be
 * used with j and k, because nothing would say which tile you are on.
 *
 * The panel is a flex centre so the block sits in the middle of the tile whatever it
 * contains, while the block's own contents stay left-aligned. Centring the text as well
 * was tried and is worse to read: a ragged left edge on a description costs more than the
 * symmetry is worth.
 */
export const TilePanel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Against the tile, so the frame stays in proportion as the tile changes size. */
  padding: 7cqw;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.74);
  opacity: 0;
  transition: opacity ${({ theme }) => theme.motion?.duration?.fast ?? '0.1s'}
    ${({ theme }) => theme.motion?.easing ?? 'ease'};

  /*
   * Never takes the pointer itself, at any point, so a click anywhere on a tile lands on
   * the link underneath and opens the app. Only the controls inside opt back in. Turning
   * this on at hover was what made the panel swallow the click that the panel appearing
   * had just invited.
   */
  pointer-events: none;

  a,
  button {
    pointer-events: auto;
  }

  ${Tile}:hover &,
  ${Tile}:focus-within & {
    opacity: 1;
  }
`

/** The block itself: centred in the tile, and read normally inside. */
export const TilePanelBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3cqw;
  width: 100%;
  min-width: 0;
  text-align: left;
`

/**
 * The card's title treatment, on a cover rather than on the page.
 *
 * Plain text, not a link. The cover behind it already links to the same place, and two
 * links carrying one name is a duplicate stop on a keyboard and a duplicate announcement
 * in a screen reader.
 */
/*
 * Everything in the panel is sized in cqw - a share of the tile's own width - rather than
 * in points. The tile is 149px on a laptop and 112px on a phone, and a type scale built
 * for a page has no size that works in both: 14px filled a phone tile with four words.
 */
export const TileTitle = styled.span`
  font-size: clamp(11px, 9cqw, 15px);
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  letter-spacing: -0.01em;
  color: #ffffff;
  text-decoration: none;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

/**
 * The card's description, clamped harder.
 *
 * A tile is 242px across at its widest and 178px on a phone, against a card's full column,
 * so the two lines the card allows would take most of the panel on their own.
 */
export const TileDescription = styled.p`
  margin: 0;
  font-size: clamp(9.5px, 7.5cqw, 13px);
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.85);
  text-wrap: pretty;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

/** Sized against the tile, which is only about 149px across. */
export const TileTags = styled(TagRow)`
  font-size: clamp(9px, 7cqw, 12px);
  gap: 0 0.6em;
  /* Two lines of tags at most, so the description keeps its three. */
  max-height: 2.8em;
  overflow: hidden;
`

/** White rather than the gradient, since the panel sits over a photograph. */
export const TileTag = styled(Tag)`
  && {
    color: rgba(255, 255, 255, 0.92);
    -webkit-text-fill-color: rgba(255, 255, 255, 0.92);
  }
`

/**
 * The action icons, scaled to the tile like everything else in the panel. At their page
 * size the three of them took half the width of a phone tile.
 */
export const TileActions = styled.div`
  svg {
    width: clamp(12px, 11cqw, 18px);
    height: clamp(12px, 11cqw, 18px);
  }

  > * {
    gap: 3.5cqw;
  }
`

/** Age and build, at the card's own size. */
export const TileMeta = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  font-size: clamp(8.5px, 6.5cqw, 11px);
  color: rgba(255, 255, 255, 0.75);
`

/** List: one row per tool, for scanning names and builds rather than looking at pictures. */
/**
 * Rows are separated by space, not by rules.
 *
 * Eight hairlines down a short list is eight lines of furniture for a page that has no
 * other; the gap does the same job and adds nothing to look at.
 */
export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

/**
 * An article, not an anchor, for the same reason the grid tile is one: the row now carries
 * the action buttons and the tag filters, and an anchor may not contain either. The link
 * is `RowLink`, stretched over the whole row underneath the content, so the row is still
 * one click target and one tab stop.
 */
export const Row = styled.article<{ $disabled?: boolean }>`
  position: relative;
  /*
   * Two columns, not three. The third held the date, which had nothing to align to and so
   * sat off on its own at the top right of every row. It belongs on the footer line with
   * the tags, where the eye is already reading.
   */
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  /* Stretch, so the cover can take the row's full height whatever the text does to it. */
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  margin: -${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii?.md ?? '10px'};
  color: inherit;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  /*
   * What is behind the row's text, published for anything inside that has to paint over
   * it - the description's "more" sits on the last line under a fade, and the fade is only
   * invisible if it is the same colour as whatever is behind it. A variable rather than a
   * fixed colour because that answer changes under the pointer.
   */
  --row-surface: ${({ theme }) => theme.colors.background};
  background: var(--row-surface);

  &:hover {
    --row-surface: ${({ theme }) => theme.colors.secondary};
  }

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: -2px;
  }
`

/** The row's click target. It sits under the content so the buttons above it still win. */
export const RowLink = styled.a`
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;

  &:focus-visible {
    outline: none;
  }
`

/**
 * Everything visible sits above the stretched link. Text stays transparent to the pointer
 * so the row still reads as one target; the controls inside opt back in.
 */
export const RowContent = styled.div`
  position: relative;
  z-index: 1;
  min-width: 0;
  pointer-events: none;

  a,
  button {
    pointer-events: auto;
  }
`

/**
 * 88px square, and it is the reason the row is as tall as it is.
 *
 * At 28px, and then at 56px, the covers were too small to tell one screenshot from
 * another, which is the only thing a thumbnail is for. This is large enough to recognise
 * a tool by sight without the row becoming a card.
 *
 * Square corners, because that is what a cover is everywhere else here - the feed's and
 * the grid's are both unrounded, and this one was the odd one out.
 *
 * It holds its width and takes whatever height the row turns out to be, so the left edge
 * of the list stays straight while the rows breathe. The height is paid for by cropping
 * in: cover keeps the middle of the shot at the cost of its sides, which for a screenshot
 * is the right half of the bargain - and the wider it is, the less of the sides it loses.
 */
export const RowThumb = styled.img`
  position: relative;
  z-index: 1;
  width: 104px;
  height: 100%;
  min-height: 96px;
  object-fit: cover;
  display: block;
  background: ${({ theme }) => theme.colors.secondary};
`

/**
 * Three rows against the cover's three edges: the title line on its top, the footer on its
 * bottom, and the description filling whatever is left between them.
 *
 * A grid with a flexible middle rather than a stack, because a stack only lines up with
 * the cover when the text happens to be exactly as tall as it is. Any shorter and the
 * footer floated somewhere above the cover's bottom edge, which is most of what made these
 * rows look untidy.
 */
export const RowMain = styled(RowContent)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  height: 100%;
  gap: 4px;
`

/**
 * Title on the left, the actions on the right.
 */
export const RowTitleLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const RowTitle = styled.div`
  /*
   * Trimmed to the ink, so the box the grid aligns is the cap-to-baseline of the words
   * rather than the font's em box with its leading either side. Without it the title sat
   * about 7px below the cover's top edge while its box sat exactly on it, which is the
   * gap between a line being aligned and a line looking aligned.
   *
   * Where this is not supported nothing breaks; the leading simply stays, which is where
   * this started.
   */
  text-box: trim-both cap alphabetic;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text};
`

/**
 * Three lines, with the control for the rest sitting on the end of the last - the same
 * shape the feed's cards use. Three is what the cover's height affords: at two there was
 * a band of empty row between the description and the footer.
 *
 * The fade behind it follows the row rather than naming a colour, so it stays invisible
 * when the row lights up under the pointer.
 */
export const RowDescription = styled(ClampedText).attrs({
  lines: 3,
  fade: 'var(--row-surface)',
})`
  /* Sits at the top of the space it is given rather than centred in it. */
  align-self: start;

  font-size: ${({ theme }) => theme.typography.size?.sm ?? '0.8125rem'};
  color: ${({ theme }) => theme.colors.muted};
`

/** Age and build, on the title's line. */
export const RowMeta = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.size?.xs ?? '0.75rem'};
  color: ${({ theme }) => theme.colors.muted};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
`

/** Below sm the build column is what gives, since the date is the better scan key. */
export const RowBuild = styled.span`
  display: none;

  ${({ theme }) => theme.query.wide} {
    display: inline;
  }
`

/**
 * Tags and actions share the line below the description, rather than the actions joining
 * the date on the right. On a phone the three icons plus the date took a third of the row
 * and left the description with about twenty characters.
 */
/**
 * Tags on the left, the age on the right.
 *
 * A grid rather than a flex row, so the age holds the row's right edge and the first tag
 * line's baseline no matter how many lines the tags take. Pushed right inside a wrapping
 * flex row instead, it rode the last tag line and moved every time the tags rewrapped.
 */
export const RowFooter = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  /* Trimmed for the same reason, so the last baseline lands on the cover's bottom edge. */
  text-box: trim-both cap alphabetic;
  gap: ${({ theme }) => theme.spacing.sm};
  align-self: end;
`

/**
 * Every tag, wrapped onto as many lines as it takes.
 *
 * Nothing here is truncated. Each tag keeps its own width so it can never break inside
 * its own word, and the row wraps instead - which it can now do freely, because the
 * actions moved up to the title and there is nothing left on this line to collide with.
 */
export const RowTags = styled(TagRow)`
  font-size: ${({ theme }) => theme.typography.size?.xs ?? '0.75rem'};
  gap: 0 0.75em;

  > * {
    flex: 0 0 auto;
    white-space: nowrap;
    word-break: normal;
  }
`

export const RowTag = styled(Tag)``

/**
 * The action icons, on the title's line at the right of the row.
 *
 * Up here they have one stable single line to align to. Down among the tags they sat
 * against text that rewraps, so they moved whenever the tags did.
 */
export const RowActions = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  /*
   * The action row carries the card's own padding - 16px above the icons and 8px below -
   * which belongs to a card caption and not to a list row. Left on, it made the title line
   * 41px tall around 17px of content and pushed the title 12px below the cover's top edge.
   */
  > * {
    padding: 0;
    gap: ${({ theme }) => theme.spacing.sm};
  }

  svg {
    width: 17px;
    height: 17px;
  }
`
