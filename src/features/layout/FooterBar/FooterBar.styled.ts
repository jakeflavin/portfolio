import styled from "styled-components";

/** Deliberately unpanelled — the footer should recede, not sit in a bordered box. */
export const FooterContainer = styled.footer`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
`;

export const Text = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.typography.size?.sm ?? "0.75rem"};
`;

export const Heart = styled.span`
  color: ${({ theme }) => theme.colors.heart};
`;
