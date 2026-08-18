import styled from "styled-components";

/**
 * A filled block rather than an open region — flat and borderless still, but with enough
 * surface to read as a deliberate section instead of empty page.
 */
export const HeroContainer = styled.div`
  width: 100%;
  min-height: 200px;
  height: 32vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.radii?.lg ?? "16px"};
`;
