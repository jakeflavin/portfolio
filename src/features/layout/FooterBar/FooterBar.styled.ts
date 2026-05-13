import styled from "styled-components";

export const Text = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  padding: ${({ theme }) => theme.spacing.md};
`;
