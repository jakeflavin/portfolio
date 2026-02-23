import styled from "styled-components";

export const Wrapper = styled.div<{ $hasError?: boolean; $fullWidth?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  min-width: 0;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "12rem")};
  max-width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: ${({ theme, $hasError }) =>
    $hasError ? `1px solid ${theme.colors.muted}` : "none"};
  outline-offset: -1px;
`;

export const TriggerLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  min-width: 0;
  min-height: 0;
  width: 100%;

  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  line-height: 1.5;
  text-align: left;

  color: ${({ theme }) => theme.colors.surface};
  background-color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  cursor: pointer;
  transition: opacity 0.2s ease, background-color 0.2s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const Chevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "none")};
`;

export const Listbox = styled.ul<{
  $position?: { top?: number; bottom?: number; left: number; width: number };
}>`
  position: ${({ $position }) => ($position ? "fixed" : "absolute")};
  top: ${({ $position }) =>
    $position?.top != null ? `${$position.top}px` : $position?.bottom != null ? "auto" : "calc(100% + 4px)"};
  bottom: ${({ $position }) =>
    $position?.bottom != null ? `${$position.bottom}px` : "auto"};
  left: ${({ $position }) => ($position ? `${$position.left}px` : "0")};
  width: ${({ $position }) => ($position ? `${$position.width}px` : "auto")};
  right: ${({ $position }) => ($position ? "auto" : "0")};
  z-index: 1000;
  margin: 0;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  list-style: none;

  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  max-height: 16rem;
  overflow-y: auto;
  isolation: isolate;
`;

export const OptionItem = styled.li<{ $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  cursor: pointer;
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.secondary : "transparent"};
  color: ${({ theme }) => theme.colors.text};
  user-select: none;
  position: relative;
  z-index: 1;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
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
