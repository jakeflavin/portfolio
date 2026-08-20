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
export const Rows = styled.div`
  display: flex;
  flex-direction: column;
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
  grid-template-columns: 88px minmax(0, 1fr);
  align-items: start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  color: inherit;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
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
 * Square with square corners, because that is what a cover is everywhere else here - the
 * feed's and the grid's are both unrounded, and this one was the odd one out.
 */
export const RowThumb = styled.img`
  position: relative;
  z-index: 1;
  width: 88px;
  height: 88px;
  object-fit: cover;
  display: block;
  background: ${({ theme }) => theme.colors.secondary};
`

export const RowMain = styled(RowContent)`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

/**
 * Title on the left, age on the right, sharing a baseline.
 *
 * The age used to be a column of the row, which gave it nothing to line up with and left
 * it hanging in space beside a two-line description. Here it has the title's baseline and
 * the row's right edge, which is two more alignments than it had.
 */
export const RowTitleLine = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const RowTitle = styled.div`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text};
`

/**
 * Two lines, with a control for the rest.
 *
 * No fade colour is passed, so the control takes its own line rather than sitting under
 * one: the row lights up under the pointer, and a fade can only be invisible against a
 * background that holds still.
 */
export const RowDescription = styled(ClampedText).attrs({ lines: 2 })`
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

  ${({ theme }) => theme.media.sm} {
    display: inline;
  }
`

/**
 * Tags and actions share the line below the description, rather than the actions joining
 * the date on the right. On a phone the three icons plus the date took a third of the row
 * and left the description with about twenty characters.
 */
/**
 * Tags on the left, actions on the right, on one line.
 *
 * Not wrapped: the actions are three 16px glyphs and the tags are 12px text, and when the
 * tags took a second line the icons ended up alongside the middle of the tag block with
 * nothing to align to. The tags give way instead - they are the least load-bearing thing
 * in the row, and the same tags are one line up in the search field.
 */
export const RowFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: 2px;
  min-width: 0;
`

/**
 * One line of tags, cut at the row's edge rather than wrapped.
 *
 * Every tag holds its own width - without that they were squeezed until the words broke
 * inside themselves, and a phone showed "#weath er". What does not fit is clipped under a
 * short fade, so the cut reads as more-to-the-right instead of as damage.
 */
export const RowTags = styled(TagRow)`
  font-size: ${({ theme }) => theme.typography.size?.xs ?? '0.75rem'};
  flex-wrap: nowrap;
  overflow: hidden;
  min-width: 0;
  mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent 100%);

  > * {
    flex: 0 0 auto;
    white-space: nowrap;
    word-break: normal;
  }
`

export const RowTag = styled(Tag)``

/**
 * The action icons, at the end of the footer line and never squeezed.
 *
 * Their own gap, tighter than the page's, so three glyphs read as one control rather than
 * as three separate things that happen to be near each other.
 */
export const RowActions = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;

  > * {
    gap: ${({ theme }) => theme.spacing.sm};
  }

  svg {
    width: 17px;
    height: 17px;
  }
`
