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
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.md} {
    padding: 72px ${({ theme }) => theme.spacing.lg};
  }
`;

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

/** Sits under the headline the way a caption sits under a post. */
export const Meta = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  color: ${({ theme }) => theme.colors.muted};

  /* A gradient hairline, the one place the brand sweep appears besides the wordmark. */
  &::before {
    content: "";
    display: block;
    width: 44px;
    height: 3px;
    margin: 0 auto ${({ theme }) => theme.spacing.md};
    border-radius: 999px;
    background: ${({ theme }) => theme.gradient?.compact ?? "currentColor"};
  }
`;
