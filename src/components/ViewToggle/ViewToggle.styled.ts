import { styled } from "styled-components";

/**
 * A segmented control that lives inside the search bar's surface.
 *
 * It reads as part of the field rather than as a separate control beside it, which is what
 * keeps the row to one object instead of three.
 */
export const Segmented = styled.div`
  display: flex;
  align-self: stretch;
  align-items: center;
  gap: 2px;
  flex: 0 0 auto;
  padding: 0 6px 0 4px;
  /* Its own colour: the divider token is switched off under the flat pass. */
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Segment = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radii?.sm ?? "8px"};
  cursor: pointer;
  background: ${({ theme, $active }) => ($active ? theme.colors.surface : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.muted)};
  transition: color ${({ theme }) => theme.motion?.duration?.fast ?? "0.1s"}
    ${({ theme }) => theme.motion?.easing ?? "ease"};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  /*
   * The control sits inside the field, which already shows one focus ring for the whole
   * row, so a second ring here would double up while tabbing through.
   */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusBorder};
    outline-offset: -2px;
  }
`;
