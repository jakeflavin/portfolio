import styled from "styled-components";

interface CardWrapperProps {
  $disabled?: boolean;
}

/**
 * An Instagram post: header, tall full-bleed media, an action row, then the caption.
 *
 * The card is not one big anchor — a post never is. The title, the media and each action
 * are their own controls, which is both how Instagram behaves and the only valid way to
 * nest buttons and links inside it.
 */
export const CardWrapper = styled.article<CardWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.radii?.md ?? "12px"};
  overflow: hidden;

  ${({ $disabled }) =>
    $disabled &&
    `
    opacity: 0.5;
  `}
`;

export const PostHeader = styled.header`
  display: flex;
  align-items: baseline;
  gap: 5px;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.sm};
`;

/** The title slot: semibold, and a link, where a post carries its username. */
export const HeaderTitle = styled.a`
  min-width: 0;
  font-size: ${({ theme }) => theme.typography.size?.lg ?? "0.9375rem"};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`;

/** Portrait media is the single most recognisable thing about a post. */
export const Media = styled.a`
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: #000000;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
  }

  &:hover::after {
    opacity: 0.04;
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  /* Square media, cropped to fill — the classic post. Screenshots should be 1:1
     (1080x1080) to land without cropping. */
  object-fit: cover;
  display: block;
  filter: ${({ theme }) => theme.img.brightness};
`;

/** Where the like/comment/share row sits on a post — with real actions in its place. */
export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.sm};
`;

const actionStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  line-height: 0;
  cursor: pointer;
`;

export const ActionLink = styled.a<{ $end?: boolean }>`
  ${actionStyles}
  color: ${({ theme }) => theme.colors.text};
  /* Pushed hard right, where a post keeps its bookmark. */
  ${({ $end }) => $end && "margin-left: auto;"}
  transition: opacity ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    opacity: 0.55;
  }
`;

export const ActionButton = styled.button`
  ${actionStyles}
  color: ${({ theme }) => theme.colors.text};
  transition: opacity ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    opacity: 0.55;
  }
`;

export const Caption = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
`;

export const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.muted};
  text-wrap: pretty;
`;

export const HashTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 6px;
  line-height: 1.4;
`;

/**
 * Hashtags are links on Instagram, so these filter the directory. Caption links there are
 * a dark navy rather than the bright action blue.
 */
export const HashTag = styled.button`
  padding: 0;
  background: none;
  border: none;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.size?.sm ?? "0.8125rem"};
  color: ${({ theme }) => theme.colors.link ?? theme.colors.accent};
  cursor: pointer;
  word-break: break-word;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

/** Post age, small and muted at the foot of the caption, as on a post. */
export const Timestamp = styled.time`
  margin-top: 2px;
  font-size: ${({ theme }) => theme.typography.size?.xs ?? "0.75rem"};
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

/** Instagram's verified check, here meaning the app is deployed and reachable. */
export const Verified = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  line-height: 0;
  color: ${({ theme }) => theme.colors.accent};
`;
