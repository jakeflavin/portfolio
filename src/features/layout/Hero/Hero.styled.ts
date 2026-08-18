import styled from "styled-components";

/**
 * Wears the same surface as a post: white/dark fill, hairline border, matching radius.
 * A large secondary-coloured block read as an oversized input next to the search field.
 */
export const HeroContainer = styled.div`
  width: 100%;
  /* Hugs its content rather than filling a slice of the viewport, which left the block
     looking empty. The min-height only reserves room for the line to wrap to two without
     the box jumping as the typewriter runs. */
  min-height: 132px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.radii?.md ?? "12px"};
`;
