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
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    padding: 72px ${({ theme }) => theme.spacing.lg};
  }
`;
