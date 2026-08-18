import styled from "styled-components";

/**
 * The whole profile block, on the hero's surface.
 *
 * Stacked on phones, as Instagram is. From md it becomes a grid so the bio sits in the
 * right-hand column aligned under the stats rather than wrapping back under the avatar —
 * which is how the profile header reads on desktop.
 */
export const Panel = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.radii?.lg ?? "16px"};
  box-shadow: ${({ theme }) => theme.shadows.raised ?? "none"};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "avatar identity"
      "gutter bio"
      "highlights highlights";
    column-gap: ${({ theme }) => theme.spacing.xl};
    row-gap: ${({ theme }) => theme.spacing.md};
    align-items: start;
  }
`;

/** Avatar on the left, identity column on the right. */
export const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    display: contents;
  }
`;

/**
 * The gradient ring Instagram puts around an avatar with an unwatched story. The ring is
 * the outer element; the inner circle sits inside it with a surface-coloured gap.
 */
export const AvatarRing = styled.div`
  grid-area: avatar;
  flex-shrink: 0;
  width: 78px;
  height: 78px;
  padding: 3px;
  border-radius: ${({ theme }) => theme.radii?.pill ?? "999px"};
  background: ${({ theme }) => theme.gradient?.brand ?? "none"};

  ${({ theme }) => theme.media.md} {
    width: 104px;
    height: 104px;
  }
`;

export const Avatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii?.pill ?? "999px"};
  background: ${({ theme }) => theme.colors.secondary};
  border: 2px solid ${({ theme }) => theme.colors.surface};
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};

  svg {
    width: 44%;
    height: 44%;
    display: block;
  }
`;

export const IdentityColumn = styled.div`
  grid-area: identity;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;

  ${({ theme }) => theme.media.md} {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const Handle = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.size?.xl ?? "1.25rem"};
  font-weight: ${({ theme }) => theme.typography.weight?.normal ?? 400};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.media.md} {
    font-size: 1.5rem;
  }
`;

/** Instagram's counts row: value in semibold, label in the body weight beside it. */
export const Stats = styled.dl`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const Stat = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};

  dt {
    order: 2;
    color: ${({ theme }) => theme.colors.muted};
  }

  dd {
    order: 1;
    margin: 0;
    font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Bio = styled.div`
  grid-area: bio;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/**
 * Bio hashtags. They double as a tag index for the directory, so they filter rather than
 * being decoration — consistent with the hashtags on each card.
 */
export const BioTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
  margin-top: 2px;
`;

export const BioTag = styled.button`
  padding: 0;
  background: none;
  border: none;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  transition: color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

/** A horizontally scrolling rail, as the highlights row is. */
export const Highlights = styled.div`
  grid-area: highlights;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  padding-top: ${({ theme }) => theme.spacing.xs};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${({ theme }) => theme.media.md} {
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const Highlight = styled.button`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 74px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radii?.sm ?? "8px"};
  }
`;

/** Highlights get a plain ring; the gradient is reserved for the avatar. */
export const HighlightRing = styled.span`
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii?.pill ?? "999px"};
  background: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    transform ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  ${Highlight}:hover & {
    background: ${({ theme }) => theme.colors.border};
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    ${Highlight}:hover & {
      transform: none;
    }
  }
`;

export const HighlightLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size?.xs ?? "0.75rem"};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;
