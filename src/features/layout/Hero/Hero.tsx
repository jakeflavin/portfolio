import React from "react";
import TypeWriter from "@/ui/TypeWriter";
import { HeroContainer, Name, Tagline, Prompt, Blurb } from "./Hero.styled";

const Hero: React.FC = () => {
  return (
    <HeroContainer>
      <Name>Jake Flavin</Name>
      <Tagline>
        <Prompt aria-hidden="true">&gt;</Prompt>
        <TypeWriter
          sentences={[
            "I build useful tools.",
            "I design clean systems.",
            "I ship small things often."
          ]}
        />
      </Tagline>
      <Blurb>
        Every project below is its own standalone app. Pick one and it opens straight away —
        no sign-up, no setup.
      </Blurb>
    </HeroContainer>
  );
};

export default Hero;
