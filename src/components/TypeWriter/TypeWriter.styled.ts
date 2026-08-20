import styled from 'styled-components'

/**
 * The two layers sit in one grid cell: a hidden copy of the finished text holds the box
 * open, and the live text is drawn over it.
 *
 * Without it the paragraph grows the header line by line as it types — 61px on a phone,
 * shoving the whole grid below it down, once every twenty seconds. Reserving the space
 * from the settled text rather than from a fixed height means the reservation follows the
 * copy, and is right at every width without a breakpoint.
 */
export const Wrapper = styled.div`
  display: grid;

  > * {
    grid-area: 1 / 1;
  }

  font-size: ${({ theme }) => theme.typography.typewriter?.size ?? 'clamp(26px, 4vw, 40px)'};
  font-weight: ${({ theme }) => theme.typography.weight?.normal ?? 400};
  line-height: 1.45;
  letter-spacing: ${({ theme }) => theme.typography.typewriter?.tracking ?? '-0.03em'};
  text-transform: ${({ theme }) => theme.typography.typewriter?.transform ?? 'none'};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.muted};
  /*
   * Greedy wrapping, explicitly - not the pretty the other paragraphs use.
   *
   * That mode looks back over the last few lines and re-breaks them to avoid leaving a
   * short final line. That is the right call for a paragraph that arrives all at once and
   * exactly the wrong one for a paragraph that arrives a letter at a time: every few
   * keystrokes it would pull a word down from a line above to rebalance, and the text
   * already on screen would shift under the reader. Greedy wrapping never moves a break
   * that has already been made, so only the word being typed can move.
   */
  text-wrap: wrap;
`

/**
 * Holds the box open at the finished size.
 *
 * The text is drawn by a pseudo-element from an attribute, so it lays out but never
 * enters the DOM — a duplicate text node here would be found by every `getByText` in the
 * suite, and read out twice by a screen reader.
 */
export const Ghost = styled.span`
  visibility: hidden;
  pointer-events: none;

  &::before {
    content: attr(data-text);
  }
`

/** The text as it is being typed, drawn over the reservation. */
export const Live = styled.span``

/**
 * Takes no width, so it cannot decide where a line breaks.
 *
 * As an ordinary inline glyph it was four characters wide with its margin, and near the
 * end of a line that was enough to push the word before it onto the next one - or to wrap
 * alone, a caret sitting by itself under the sentence. It is drawn outside its own box
 * instead, which also means the hidden copy that reserves the space does not have to
 * account for it, so the two wrap at exactly the same points.
 */
export const Cursor = styled.span`
  display: inline-block;
  width: 0;
  overflow: visible;
  white-space: nowrap;
  margin-left: 3px;
  font-weight: ${({ theme }) => theme.typography.weight?.normal ?? 400};
  color: ${({ theme }) => theme.colors.muted};
  animation: blink 2s infinite;

  @keyframes blink {
    0%,
    50%,
    100% {
      opacity: 1;
    }
    25%,
    75% {
      opacity: 0;
    }
  }
`
