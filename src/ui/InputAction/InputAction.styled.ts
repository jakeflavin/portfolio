import styled from "styled-components";

interface WrapperProps {
  $disabled?: boolean;
  $hasLabel?: boolean;
  $hasError?: boolean;
}

export const Outer = styled.div`
  width: 100%;
`;

export const Label = styled.label`
  position: absolute;
  top: 0;
  left: ${({ theme }) => theme.spacing.md};
  transform: translateY(-50%);
  padding: 0 ${({ theme }) => theme.spacing.xs};
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.secondary};
  z-index: 1;
  white-space: nowrap;
`;

export const Wrapper = styled.div<WrapperProps>`
  position: ${({ $hasLabel }) => ($hasLabel ? "relative" : "static")};
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.sm};

  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.secondary};
  border: none;
  border-radius: ${({ theme }) => theme.radii?.sm ?? "8px"};
  transition: background-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    box-shadow ${({ theme }) => theme.motion?.duration?.normal ?? "0.15s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  ${({ $disabled }) =>
    $disabled &&
    `
    cursor: not-allowed;
    pointer-events: none;
  `}

  &:focus-within {
    box-shadow: ${({ theme, $disabled }) =>
      $disabled ? "none" : theme.shadows.focus};
  }

  &:focus-within ${Label} {
    color: ${({ theme, $disabled }) =>
      $disabled ? theme.colors.muted : theme.colors.focusBorder};
  }
`;

export const LeftIconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;

  padding: ${({ theme }) => theme.spacing.sm} 0;
  margin: 0;

  font: inherit;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 1;
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.muted};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-left: 1px;
  font-size: 0.8125rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.muted};
`;
