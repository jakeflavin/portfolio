import React from "react";
import TypeWriter from "../../core/TypeWriter";
import { HeroContainer } from "./Hero.styled";

const Hero: React.FC = () => {
  return (
    <HeroContainer>
      <TypeWriter
        sentences={[
          "Hi, I'm Jake.",
          "I build useful tools.",
          "I design clean systems.",
          "Welcome to my portfolio."
        ]}
      />
    </HeroContainer>
  );
};

export default Hero;
