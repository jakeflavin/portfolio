import styled from 'styled-components'

/**
 * The same radius as the profile panel it sits beside, so the two read as a pair of
 * tiles rather than a picture next to a card.
 *
 * The blur is on the canvas, not in the drawing: one pass over the finished frame is
 * cheaper than five blurred gradients, and it is what turns hard-edged orbs into weather.
 * The tile clips it, and the canvas is drawn a little oversize so the blur has no
 * transparent edge to pull in.
 */
export const Tile = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii?.lg ?? '16px'};
  background: ${({ theme }) => theme.gradient.stops[0]};
  min-height: 100%;

  canvas {
    position: absolute;
    inset: -24px;
    width: calc(100% + 48px);
    height: calc(100% + 48px);
    display: block;
    filter: blur(22px) saturate(1.15);
  }
`
