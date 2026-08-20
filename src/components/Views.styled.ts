import { styled } from 'styled-components'

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
  padding: 12px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.72);
  opacity: 0;
  transition: opacity ${({ theme }) => theme.motion?.duration?.fast ?? '0.1s'}
    ${({ theme }) => theme.motion?.easing ?? 'ease'};
  /* Lets a click through to the cover beneath, except on the controls themselves. */
  pointer-events: none;

  ${Tile}:hover &,
  ${Tile}:focus-within & {
    opacity: 1;
    pointer-events: auto;
  }
`

/** The block itself: centred in the tile, and read normally inside. */
export const TilePanelBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
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
export const TileTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.size?.lg ?? '0.9375rem'};
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
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.82);
  text-wrap: pretty;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /*
   * Three tiles across a phone are about 112px wide, which is not a measure any sentence
   * survives. Below sm the panel keeps the title, the actions and the date; the
   * description and the tags are what the feed and the list are there for.
   */
  display: none;

  ${({ theme }) => theme.media.sm} {
    display: -webkit-box;
  }
`

export const TileTags = styled.div`
  flex-wrap: wrap;
  gap: 0 8px;
  max-width: 100%;
  overflow: hidden;
  max-height: 2.8em;

  /* Hidden with the description, and for the same reason. */
  display: none;

  ${({ theme }) => theme.media.sm} {
    display: flex;
  }
`

export const TileTag = styled.button`
  padding: 0;
  background: none;
  border: none;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.size?.sm ?? '0.8125rem'};
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  word-break: break-word;

  &:hover {
    text-decoration: underline;
  }
`

/** Age and build, at the card's own size. */
export const TileMeta = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 0.6875rem;
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
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto;
  align-items: center;
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

export const RowThumb = styled.img`
  position: relative;
  z-index: 1;
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii?.sm ?? '8px'};
  display: block;
`

export const RowMain = styled(RowContent)`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const RowTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.size?.md ?? '0.875rem'};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text};
`

/** One line only: the list exists to be scanned, so rows must stay the same height. */
export const RowDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.size?.sm ?? '0.8125rem'};
  color: ${({ theme }) => theme.colors.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const RowMeta = styled(RowContent)`
  align-self: start;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.size?.xs ?? '0.75rem'};
  color: ${({ theme }) => theme.colors.muted};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
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
export const RowFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`

/** The row's own tag strip. */
export const RowTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

export const RowTag = styled.button`
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.size?.xs ?? '0.75rem'};
  color: ${({ theme }) => theme.colors.link ?? theme.colors.accent};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

/** The action icons, at the end of the footer line. */
export const RowActions = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`
