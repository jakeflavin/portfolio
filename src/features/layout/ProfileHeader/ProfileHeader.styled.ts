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
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii?.lg ?? "16px"};
  box-shadow: ${({ theme }) => theme.shadows.raised ?? "none"};
  /*
   * No vertical padding of its own: combined with the page gap it made the space below the
   * profile 65px against 24px everywhere else, so the rhythm broke at the top of the page.
   *
   * No border either. It was transparent under the flat pass but still occupied 1px, which
   * pushed the profile's left edge one pixel off the search field and the cards. Restore
   * a 1px divider border here if the surfaces come back.
   */
  padding: 0;
`;

/**
 * A centred block. Inside it there are exactly two left edges: the avatar and the stories
 * sit on the block's edge, and the name, counts and bio share the column beside the avatar.
 *
 * Held to a measure rather than spanning the page: full width, its content stopped well
 * short of the right edge while the card grid below ran flush to it. Centred, the leftover
 * splits evenly either side.
 */
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 560px;

  ${({ theme }) => theme.media.md} {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    /*
     * The avatar spans the identity and bio rows so those size to their own content, then
     * the highlights break out into a full-width row of their own beneath everything.
     */
    grid-template-areas:
      "avatar identity"
      "avatar bio"
      "highlights highlights";
    column-gap: ${({ theme }) => theme.spacing.lg};
    row-gap: ${({ theme }) => theme.spacing.sm};
    align-items: start;
    justify-items: start;
  }
`;

/** Avatar beside the name and counts on narrow screens; part of the grid from md. */
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
  align-self: center;
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  padding: 3px;
  border-radius: ${({ theme }) => theme.radii?.pill ?? "999px"};
  background: ${({ theme }) => theme.gradient?.brand ?? "none"};

  ${({ theme }) => theme.media.md} {
    width: 96px;
    height: 96px;
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
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;

  /* Name and counts share a row once there is width for it. */
  ${({ theme }) => theme.media.md} {
    flex-direction: row;
    align-items: baseline;
    gap: ${({ theme }) => theme.spacing.lg};
    flex-wrap: wrap;
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
  gap: ${({ theme }) => theme.spacing.xs};
`;

/** Bio hashtags. Static text: they describe the person, they do not filter anything. */
export const BioTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 8px;
`;

export const BioTag = styled.span`
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  color: ${({ theme }) => theme.colors.muted};
`;

/**
 * All the highlights fit inline at every width — they share the row rather than scrolling,
 * so nothing is hidden off the edge on a phone.
 */
export const Highlights = styled.div`
  grid-area: highlights;
  display: flex;
  justify-self: stretch;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};

  /*
   * Scrolls rather than shrinking. The items had been sharing the row, which pushed the
   * circles below a usable tap target once there were six of them.
   */
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  ${({ theme }) => theme.media.md} {
    gap: ${({ theme }) => theme.spacing.lg};
    padding-top: ${({ theme }) => theme.spacing.sm};
    overflow-x: visible;
  }
`;

/**
 * Sets the appearance toggle apart from the outbound links.
 *
 * Sized and positioned against the circle rather than stretched: stretching ran it past
 * the labels as well, and its side margins widened the gap around it so the rhythm of the
 * row broke at that point.
 */
export const HighlightDivider = styled.span`
  flex: 0 0 auto;
  align-self: flex-start;
  width: 1px;
  height: 28px;
  margin: 17px 0 0;
  background: ${({ theme }) => theme.colors.border};

  ${({ theme }) => theme.media.md} {
    margin-top: 15px;
  }
`;

/**
 * Sized to its ring, not wider. A 74px button around a 58px circle centred the circle
 * inside it, so the ring sat 8px in from the block's left edge while the button sat on it —
 * the first thing a grid overlay picks up. Labels centre under the ring and truncate, which
 * is what the app does too.
 */
export const Highlight = styled.button`
  /*
   * Sized to its ring, not wider. A wider button centred the circle inside it, so the ring
   * sat in from the block's left edge while the button sat on it — the first thing a grid
   * overlay picks up. Labels centre under the ring and truncate, as the app does.
   */
  flex: 0 0 auto;
  width: 62px;
  min-width: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.media.md} {
    width: 58px;
    min-width: 58px;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.radii?.sm ?? "8px"};
  }
`;

/**
 * The outer ring, as on a highlight: a hairline circle with a gap between it and the
 * thumbnail inside. The gap is the panel surface showing through the padding.
 */
export const HighlightRing = styled.span`
  width: 62px;
  height: 62px;
  min-width: 62px;
  flex-shrink: 0;
  /*
   * 3px of ring and 2px of gap, matching the avatar: its gradient band is the 3px padding
   * and its inner border is the 2px gap. A 1px border read as a hairline beside it.
   */
  padding: 2px;
  border-radius: ${({ theme }) => theme.radii?.pill ?? "999px"};
  border: 3px solid ${({ theme }) => theme.colors.border};
  transition: transform ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  ${({ theme }) => theme.media.md} {
    width: 58px;
    height: 58px;
    min-width: 58px;
  }

  ${Highlight}:hover & {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.muted};
  }

  @media (prefers-reduced-motion: reduce) {
    ${Highlight}:hover & {
      transform: none;
    }
  }
`;

/**
 * The thumbnail itself. The three-stop gradient reads better than the full sweep at this
 * size, and the icon sits in white since the fill is saturated.
 */
export const HighlightFill = styled.span`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii?.pill ?? "999px"};
  background: ${({ theme }) => theme.gradient?.compact ?? theme.colors.secondary};
  color: #ffffff;
  transition: filter ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  ${Highlight}:hover & {
    filter: brightness(1.08);
  }

  svg {
    display: block;
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
