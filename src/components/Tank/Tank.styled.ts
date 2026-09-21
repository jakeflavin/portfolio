import styled from 'styled-components'

/**
 * The same radius as the profile panel it sits beside, so the two read as a pair of
 * tiles rather than a picture next to a card. The canvas fills it and paints the fill
 * itself, so the tile is just a clip.
 */
export const Glass = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii?.lg ?? '16px'};
  min-height: 100%;
  cursor: pointer;

  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    touch-action: manipulation;
  }
`
