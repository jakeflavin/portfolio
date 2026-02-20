import styled from "styled-components";

export const Wrapper = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: stretch;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xs};
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
  user-select: none;
`;

export const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const Track = styled.span<{ $checked: boolean }>`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: 2.5rem;
  height: 1.25rem;
  border-radius: 999px;
  background-color: ${({ theme, $checked }) =>
    $checked ? theme.colors.primary : theme.colors.border};
  transition: background-color 0.2s ease;

  ${Wrapper}:hover:not([data-disabled]) & {
    background-color: ${({ theme, $checked }) =>
      $checked ? theme.colors.accent : theme.colors.muted};
  }
`;

export const Thumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(1.25rem - 4px);
  height: calc(1.25rem - 4px);
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.2s ease;
  transform: ${({ $checked }) => ($checked ? "translateX(1.25rem)" : "translateX(0)")};
`;

export const LabelText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.text};
`;
