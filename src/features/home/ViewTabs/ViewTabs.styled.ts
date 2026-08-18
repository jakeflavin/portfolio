import styled from "styled-components";

/**
 * Instagram's profile tabs: a centred row above the content, separated by a rule, with the
 * active tab marked by a border on top rather than underneath.
 */
export const TabList = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
`;

export const Tab = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xs};
  margin-top: -1px;
  background: none;
  border: none;
  border-top: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.text : "transparent")};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-size: ${({ theme }) => theme.typography.size?.xs ?? "0.75rem"};
  font-weight: ${({ theme }) => theme.typography.weight?.semibold ?? 600};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.subtle)};
  transition: color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: -2px;
  }

  svg {
    display: block;
  }
`;
