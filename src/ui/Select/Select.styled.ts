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
  border-radius: ${({ theme }) => theme.radii?.sm ?? "8px"};
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
  font-size: 1rem;
  font-weight: 400;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  line-height: 1.5;
  text-align: left;

  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme, disabled }) =>
    disabled
      ? theme.colors.secondary
      : theme.colors.secondary};
  border: none;
  border-radius: ${({ theme }) => theme.radii?.sm ?? "8px"};
  box-shadow: none;

  cursor: pointer;
  transition: background-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    box-shadow ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.muted};
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export const Chevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.muted};
  transition: transform ${({ theme }) => theme.motion?.duration?.fast ?? "0.2s"} ${({ theme }) => theme.motion?.easing ?? "ease"};
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
  border-radius: ${({ theme }) => theme.radii?.md ?? "12px"};
  box-shadow: ${({ theme }) => theme.shadows.mdDown};
  max-height: 16rem;
  overflow-y: auto;
  isolation: isolate;
`;

export const OptionItem = styled.li<{ $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin: 0 ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.875rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  cursor: pointer;
  background-color: ${({ theme, $selected }) =>
    $selected ? (theme.colors.secondaryGlass ?? theme.colors.secondary) : "transparent"};
  color: ${({ theme }) => theme.colors.text};
  user-select: none;
  position: relative;
  z-index: 1;
  transition: background-color ${({ theme }) => theme.motion?.duration?.fast ?? "0.2s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    box-shadow ${({ theme }) => theme.motion?.duration?.fast ?? "0.2s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryGlass ?? theme.colors.secondary};
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
