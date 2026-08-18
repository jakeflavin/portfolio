import styled from "styled-components";

export const Wrapper = styled.div`
  font-size: ${({ theme }) => theme.typography.typewriter?.size ?? "clamp(26px, 4vw, 40px)"};
  font-weight: ${({ theme }) => theme.typography.weight?.bold ?? 700};
  line-height: 1.15;
  letter-spacing: ${({ theme }) => theme.typography.typewriter?.tracking ?? "-0.03em"};
  text-transform: ${({ theme }) => theme.typography.typewriter?.transform ?? "none"};
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  text-wrap: balance;
`;

export const Cursor = styled.span`
  margin-left: 2px;
  font-weight: ${({ theme }) => theme.typography.weight?.normal ?? 400};
  color: ${({ theme }) => theme.colors.muted};
  animation: blink 2s infinite;

  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
  }
`;
