import styled from "styled-components";

export const Wordmark = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  /* Instrument Serif ships a single weight, so size and letterform carry the emphasis. */
  font-size: 1.625rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`;

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-left: auto;
`;
