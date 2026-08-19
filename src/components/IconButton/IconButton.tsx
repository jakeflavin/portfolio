import React from 'react'
import { Button } from './IconButton.styled'

interface IconButtonProps {
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>
  /** Icon shown when active (e.g. filled variant). If not provided, icon is unchanged when active. */
  activeIcon?: React.ReactElement<React.SVGProps<SVGSVGElement>>
  /** Whether the button is in the active state */
  active?: boolean
  /** Override icon color (default: uses variant – bar uses inverseText, default uses primary) */
  color?: string
  size?: number
  onClick?: () => void
  ariaLabel?: string
}

export function IconButton({
  icon,
  activeIcon,
  active = false,
  color,
  size = 24,
  onClick,
  ariaLabel,
}: IconButtonProps) {
  const sourceIcon = active && activeIcon ? activeIcon : icon
  // Size only. Setting `fill` floods stroke-based icons solid; the button carries the
  // colour and the icon inherits it through currentColor.
  const styledIcon = React.cloneElement(sourceIcon, { width: size, height: size })

  return (
    <Button onClick={onClick} aria-label={ariaLabel} $color={color}>
      {styledIcon}
    </Button>
  )
}

export default IconButton
