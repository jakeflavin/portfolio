import styled from "styled-components";

/**
 * Unboxed on purpose. In this language a bordered surface means a post, so wrapping the
 * hero in one made it read as another card rather than as the page's opening statement.
 * Its presence comes from scale and space instead.
 */
export const HeroContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
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
