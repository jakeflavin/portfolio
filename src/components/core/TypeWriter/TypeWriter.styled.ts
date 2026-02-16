import styled from "styled-components";

export const Wrapper = styled.div`
  font-size: 2rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
`;

export const Cursor = styled.span`
  margin-left: 4px;
  animation: blink 2s infinite;

  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
  }
`;
