import styled from "styled-components";

export const Wordmark = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.size?.xl ?? "1.25rem"};
  font-weight: ${({ theme }) => theme.typography.weight?.bold ?? 700};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`;

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-left: auto;
`;
