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
  gap: 2px;
  margin-left: auto;
`;

/** Separates the outbound profile links from the appearance control. */
export const Divider = styled.span`
  width: 1px;
  align-self: stretch;
  margin: 4px ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.border};
`;
