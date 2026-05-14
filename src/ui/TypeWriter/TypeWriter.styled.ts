import styled from "styled-components";

export const Wrapper = styled.div`
  font-size: ${({ theme }) => theme.typography.typewriter?.size ?? "clamp(28px, 4.4vw, 44px)"};
  font-weight: ${({ theme }) => theme.typography.heading?.weight ?? 700};
  line-height: 1.15;
  letter-spacing: ${({ theme }) => theme.typography.typewriter?.tracking ?? "-0.025em"};
  text-transform: ${({ theme }) => theme.typography.typewriter?.transform ?? "none"};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  text-wrap: balance;
`;

export const Cursor = styled.span`
  margin-left: 4px;
  animation: blink 2s infinite;

  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
  }
`;
