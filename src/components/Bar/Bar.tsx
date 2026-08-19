import React, { ReactNode } from 'react'
import { BarContainer } from './Bar.styled'

interface BarProps {
  children: ReactNode
  align?: 'center' | 'space-between'
}

export function Bar({ children, align = 'center' }: BarProps) {
  return <BarContainer align={align}>{children}</BarContainer>
}

export default Bar
