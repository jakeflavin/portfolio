import styled from "styled-components";

interface CardWrapperProps {
  $disabled?: boolean;
}

/**
 * Laid out like an Instagram post: header row, full-bleed media, then a caption with
 * hashtags and a timestamp. The hairline is the post container itself — it is the one
 * border in the design, because a grid of posts needs each one bounded.
 */
export const CardWrapper = styled.a<CardWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.radii?.md ?? "12px"};
  overflow: hidden;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 2px;
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    cursor: default;
    opacity: 0.5;
  `}
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  /* Fixed height so the media lines up across a row whatever the title length. */
  min-height: 60px;
`;

/** Stands in for the avatar on a post. */
export const Mark = styled.div`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radii?.pill ?? "999px"};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.size?.sm ?? "0.8125rem"};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  line-height: 1;
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.card?.titleSize ?? "0.9375rem"};
  line-height: 1.3;
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  letter-spacing: ${({ theme }) => theme.typography.card?.titleTracking ?? "-0.01em"};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
  /* Wrap rather than truncate — project names are longer than usernames — but never
     past two lines, which the header height accounts for. */
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const Subtitle = styled.span`
  font-size: ${({ theme }) => theme.typography.size?.xs ?? "0.75rem"};
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.muted};
`;

export const OpenIcon = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 0;
  transition: color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  ${CardWrapper}:hover & {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  /* Placeholder ratio — swap when real app screenshots land. */
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: #000000;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
  }

  ${CardWrapper}:hover &::after {
    opacity: 0.04;
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: ${({ theme }) => theme.img.brightness};
`;

export const Caption = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.md};
`;

export const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.text};
  text-wrap: pretty;

  strong {
    font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  }
`;

/** Instagram renders hashtags in a link colour rather than as chips. */
export const HashTags = styled.div`
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.accent};
  word-break: break-word;
`;

export const Timestamp = styled.time`
  font-size: ${({ theme }) => theme.typography.size?.xs ?? "0.75rem"};
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;
