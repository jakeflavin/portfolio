import styled from "styled-components";

/**
 * A panel on the page rather than a post: it takes the card surface but a wider radius and
 * far more room, and keeps its display type. Boxing it previously cost it its presence
 * only because the type was shrunk to card scale at the same time.
 */
export const HeroContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.radii?.lg ?? "16px"};
  box-shadow: ${({ theme }) => theme.shadows.raised ?? "none"};
  /* Weighted towards the top, so the headline sits below open space rather than centred
     in the panel. */
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.lg};

  ${({ theme }) => theme.media.md} {
    padding: 64px ${({ theme }) => theme.spacing.lg} 44px;
  }
`;

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/** Sits under the headline the way a caption sits under a post. */
export const Meta = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  color: ${({ theme }) => theme.colors.muted};
`;
