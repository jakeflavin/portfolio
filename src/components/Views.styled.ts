import { styled } from 'styled-components'

/**
 * Grid: covers only, at the density the covers were captured for.
 *
 * The screenshots are the one thing every app has that is genuinely its own, so this view
 * drops everything else and lets them do the identifying. Titles stay in the accessible
 * name and the tooltip rather than on the tile.
 */
export const Tiles = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3px;

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const Tile = styled.a<{ $disabled?: boolean }>`
  position: relative;
  display: block;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.secondary};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

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
 * The title, revealed over the cover on hover and whenever the tile has keyboard focus —
 * without the focus case the view is unusable with j and k, since nothing would say which
 * tile you are on.
 */
export const TileLabel = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 10px;
  font-size: ${({ theme }) => theme.typography.size?.sm ?? '0.8125rem'};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  color: #ffffff;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0) 55%);
  opacity: 0;
  transition: opacity ${({ theme }) => theme.motion?.duration?.fast ?? '0.1s'}
    ${({ theme }) => theme.motion?.easing ?? 'ease'};

  ${Tile}:hover &,
  ${Tile}:focus-visible & {
    opacity: 1;
  }
`

/** List: one row per tool, for scanning names and builds rather than looking at pictures. */
export const Rows = styled.div`
  display: flex;
  flex-direction: column;
`

export const Row = styled.a<{ $disabled?: boolean }>`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 10px 4px;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: -2px;
  }
`

export const RowThumb = styled.img`
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii?.sm ?? '8px'};
  display: block;
`

export const RowMain = styled.div`
  min-width: 0;
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

export const RowMeta = styled.div`
  display: flex;
  align-items: baseline;
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
