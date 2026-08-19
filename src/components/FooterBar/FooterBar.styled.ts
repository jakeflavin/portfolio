import styled from 'styled-components'

/** Deliberately unpanelled — the footer should recede, not sit in a bordered box. */
export const FooterContainer = styled.footer`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
`

export const Text = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.typography.size?.sm ?? '0.75rem'};
`

/**
 * Same trick as the card tags: the gradient is clipped to the glyph, with the declared
 * colour standing as the fallback for anything that lacks -webkit-text-fill-color.
 */
export const Heart = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.gradient?.text ?? 'none'};
  background-clip: text;
  -webkit-background-clip: text;
  color: ${({ theme }) => theme.colors.heart};
  -webkit-text-fill-color: transparent;
`
