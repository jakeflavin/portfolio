import styled from 'styled-components'

/**
 * The row of icons a project carries: open it, copy its link, read its source.
 *
 * Lifted out of the card so the grid's hover panel shows the same three controls at the
 * same sizes rather than a second set that drifts. `$onImage` recolours them for the one
 * place they sit on a photograph instead of the page.
 */
/** Where the like/comment/share row sits on a post — with real actions in its place. */
export const Actions = styled.div<{ $onImage?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.sm};
`

const actionStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  line-height: 0;
  cursor: pointer;
`

export const ActionLink = styled.a<{ $end?: boolean }>`
  ${actionStyles}
  color: ${({ theme }) => theme.colors.text};
  /* Pushed hard right, where a post keeps its bookmark. */
  ${({ $end }) => $end && 'margin-left: auto;'}
  transition: opacity ${({ theme }) => theme.motion?.duration?.normal ?? '0.15s'} ${({ theme }) => theme.motion?.easing ?? 'ease'};

  &:hover {
    opacity: 0.55;
  }
`

export const ActionButton = styled.button`
  ${actionStyles}
  color: ${({ theme }) => theme.colors.text};
  transition: opacity ${({ theme }) => theme.motion?.duration?.normal ?? '0.15s'}
    ${({ theme }) => theme.motion?.easing ?? 'ease'};

  &:hover {
    opacity: 0.55;
  }
`

/** On a cover the icons cannot take the page's ink, so the row lightens as a whole. */
export const OnImage = styled.div`
  ${Actions} {
    padding: 0;
  }

  ${ActionLink},
  ${ActionButton} {
    color: #ffffff;
  }
`
