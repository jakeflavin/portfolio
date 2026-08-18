import styled from "styled-components";

export const Wrapper = styled.div<{
  $hasError?: boolean;
  $fullWidth?: boolean;
  $bare?: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  min-width: 0;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  max-width: 100%;

  ${({ theme }) => theme.media.sm} {
    width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "12rem")};
  }
  border-radius: ${({ theme, $bare }) => ($bare ? "0" : (theme.radii?.sm ?? "8px"))};
`;

/**
 * Stands in for the label on the narrowest screens. A lone chevron does not say "sort";
 * this does.
 */
export const TriggerGlyph = styled.span`
  display: flex;
  line-height: 0;
  color: ${({ theme }) => theme.colors.muted};

  ${({ theme }) => theme.media.sm} {
    display: none;
  }
`;

export const TriggerLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  /*
   * Hidden on the narrowest screens so search and sort stay on one line. The chevron is
   * still a visible control, and the trigger keeps its accessible name.
   */
  display: none;

  ${({ theme }) => theme.media.sm} {
    display: block;
  }
`;

export const Trigger = styled.button<{ $bare?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  min-width: 0;
  min-height: 0;
  width: 100%;

  /* Matches the search field beside it. */
  min-height: 38px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  font-weight: 400;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  line-height: 1.5;
  text-align: left;

  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme, $bare }) =>
    $bare ? "transparent" : theme.colors.secondary};
  border: none;
  border-radius: ${({ theme, $bare }) => ($bare ? "0" : (theme.radii?.sm ?? "8px"))};
  box-shadow: none;

  cursor: pointer;
  transition: background-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    border-color ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    box-shadow ${({ theme }) => theme.motion?.duration?.normal ?? "0.3s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  /* In bare mode the parent shows focus, so the trigger does not draw its own ring. */
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme, $bare }) => ($bare ? "none" : theme.shadows.focus)};
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
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.radii?.md ?? "12px"};
  box-shadow: ${({ theme }) => theme.shadows.mdDown};
  max-height: 16rem;
  overflow: hidden auto;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  isolation: isolate;
`;

/**
 * Full-bleed rows with a checkmark on the selected one, the way a native menu reads.
 * A filled selected row competed with the hover state.
 */
export const OptionItem = styled.li<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.size?.md ?? "0.875rem"};
  font-weight: ${({ theme, $selected }) =>
    $selected
      ? (theme.typography.weight?.semibold ?? 600)
      : (theme.typography.weight?.normal ?? 400)};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  cursor: pointer;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  user-select: none;
  position: relative;
  z-index: 1;
  transition: background-color ${({ theme }) => theme.motion?.duration?.fast ?? "0.2s"} ${({ theme }) => theme.motion?.easing ?? "ease"},
    box-shadow ${({ theme }) => theme.motion?.duration?.fast ?? "0.2s"} ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const Check = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  line-height: 0;
  color: ${({ theme }) => theme.colors.text};
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-left: 1px;
  font-size: 0.8125rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.muted};
`;
