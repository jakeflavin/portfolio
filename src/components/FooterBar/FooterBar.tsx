import React from 'react'
import { FooterContainer, Text, Heart } from './FooterBar.styled'

export function FooterBar() {
  return (
    <FooterContainer>
      <Text>
        Made with <Heart>♥</Heart> by Jake Flavin
      </Text>
    </FooterContainer>
  )
}
