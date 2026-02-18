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
  /* Top half: container color (--input-label-bg-top). Bottom half: input box color (--input-label-bg) */
  background: linear-gradient(
    to bottom,
    var(--input-label-bg-top, ${({ theme }) => theme.colors.secondary}) 50%,
    var(--input-label-bg, ${({ theme }) => theme.colors.background}) 50%
  );
  z-index: 1;
  white-space: nowrap;
`;

export const Wrapper = styled.div<WrapperProps>`
  --input-label-bg: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.secondary : theme.colors.background};
  position: ${({ $hasLabel }) => ($hasLabel ? "relative" : "static")};
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.sm};

  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.secondary : theme.colors.background};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.muted : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  ${({ $disabled }) =>
    $disabled &&
    `
    cursor: not-allowed;
    pointer-events: none;
  `}

  &:focus-within {
    border-color: ${({ theme, $disabled }) =>
      $disabled ? theme.colors.border : theme.colors.inputFocusBorder};
    box-shadow: ${({ theme, $disabled }) =>
      $disabled ? theme.shadows.sm : theme.shadows.focusInput};
  }

  &:focus-within ${Label} {
    color: ${({ theme, $disabled }) =>
      $disabled ? theme.colors.muted : theme.colors.inputFocusBorder};
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
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.5;
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
