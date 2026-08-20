import styled, { keyframes } from 'styled-components'

/** Deliberately unpanelled — the footer should recede, not sit in a bordered box. */
export const FooterContainer = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg} 0;
`

/**
 * Travels exactly half the track's width, which is why the track holds the tags twice: at
 * the moment the first copy has left, the second is sitting precisely where the first
 * began, and the reset is invisible.
 */
const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`

/**
 * The tag band: every tag in the directory, on the move, in the site's own gradient.
 *
 * It is the one place the gradient is a surface rather than ink. Everywhere else it is
 * clipped to text - the avatar's ring, the hashtags, the heart below - so putting it
 * behind something once, at the very bottom, shows the whole sweep at a size you can
 * actually see it at.
 */
export const Marquee = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii?.md ?? '10px'};
  background: ${({ theme }) => theme.gradient?.brand ?? theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  /* The band's own edges dissolve rather than cutting a tag in half at either end. */
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 24px,
    #000 calc(100% - 24px),
    transparent 100%
  );
`

export const MarqueeTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} 45s linear infinite;

  ${Marquee}:hover & {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

/** One pass of the tags. The track holds two of these, and they are identical. */
export const MarqueeGroup = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.size?.sm ?? '0.8125rem'};
  font-weight: ${({ theme }) => theme.typography.weight?.medium ?? 500};
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
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
