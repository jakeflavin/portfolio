import React from "react";
import { FooterContainer, Text, Heart } from "./FooterBar.styled";

const FooterBar: React.FC = () => {
  return (
    <FooterContainer>
      <Text>
        Made with <Heart>♥</Heart> by Jake Flavin
      </Text>
    </FooterContainer>
  );
};

export default FooterBar;
