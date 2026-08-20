import styled from 'styled-components'

/**
 * The hashtags, wherever they appear.
 *
 * One definition rather than four: the card, the grid tile, the list row and the bio were
 * each styling their own, and they had drifted to three different colours - a gradient
 * here, the link blue there, plain muted text in the bio.
 *
 * The gradient is on the row and clipped to the text inside it, which is the only way to
 * run one sweep across a group of separate words. `width: fit-content` is what makes it
 * read as a sweep at all: stretched to the container the tags sat in the first tenth of
 * it, all of them the same blue.
 */
export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
  width: fit-content;
  max-width: 100%;
  line-height: 1.4;
  background: ${({ theme }) => theme.gradient?.text ?? 'none'};
  background-clip: text;
  -webkit-background-clip: text;
`

/**
 * One hashtag. A button, because it filters the directory.
 *
 * Hover underlines rather than fading. Fading was the wrong signal twice over: it made
 * text that is already only as dark as the gradient's lightest stop harder to read, and
 * dimming is what a disabled control does, not a live one.
 */
export const Tag = styled.button`
  padding: 0;
  background: none;
  border: none;
  font: inherit;
  cursor: pointer;
  word-break: break-word;
  /*
   * The declared colour is the fallback and the transparent fill is the gradient path: any
   * browser lacking -webkit-text-fill-color also lacks the background-clip this depends
   * on, so it simply keeps the readable solid colour.
   */
  color: ${({ theme }) => theme.colors.link ?? theme.colors.accent};
  -webkit-text-fill-color: transparent;
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
