import styled from 'styled-components'

/** Holds the clamped text so an inline control can sit on its last line. */
export const Wrap = styled.div`
  position: relative;
  min-width: 0;
`

export const Text = styled.p<{ $clamped?: boolean; $lines?: number }>`
  margin: 0;
  line-height: 1.45;
  text-wrap: pretty;

  ${({ $clamped, $lines = 2 }) =>
    $clamped &&
    `
    display: -webkit-box;
    -webkit-line-clamp: ${$lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`

/**
 * While clamped and inline this sits at the end of the last line rather than below the
 * text, which is how a truncated caption reads. It is overlaid on the clamp, so it
 * carries the surface behind it plus a fade wide enough to clear the word running
 * underneath. The fade is 60px: at 40 a two or three letter stub survived under the
 * transparent end of it, which read as a clipping bug rather than as a truncation.
 *
 * Where the surface behind the text changes - a list row that lights up under the pointer
 * - there is no colour to fade to, so the control goes on its own line instead.
 */
export const More = styled.button<{ $inline?: boolean; $fade?: string }>`
  padding: 0;
  border: none;
  font: inherit;
  line-height: inherit;
  /* Full strength and medium weight, so it reads as a control rather than as more of the
     muted text it interrupts. */
  font-weight: ${({ theme }) => theme.typography.weight?.medium ?? 500};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  background: none;

  ${({ $inline, $fade }) =>
    $inline && $fade
      ? `
    position: absolute;
    right: 0;
    bottom: 0;
    padding-left: 68px;
    background: linear-gradient(to right, transparent 0, ${$fade} 60px, ${$fade} 100%);
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
