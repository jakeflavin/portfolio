import React from "react";
import TypeWriter from "@/ui/TypeWriter";
import { PROJECTS } from "@/features/projects/projects";
import { HeroContainer, Inner, Meta } from "./Hero.styled";

/** Directory metadata, not profile stats: how much is here and how fresh it is. */
function summarise(count: number, latest: Date | null) {
  const tools = `${count} ${count === 1 ? "tool" : "tools"}`;
  if (!latest) return tools;

  const shipped = latest.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
  return `${tools} · last shipped ${shipped}`;
}

const Hero: React.FC = () => {
  const live = PROJECTS.filter((project) => !project.disabled);
  const latest = live.reduce<Date | null>(
    (newest, project) =>
      !newest || project.creationDate > newest ? project.creationDate : newest,
    null
  );

  return (
    <HeroContainer>
      <Inner>
        <TypeWriter
          sentences={[
            "Hi, I'm Jake.",
            "I build useful tools.",
            "I design clean systems.",
            "Welcome to my portfolio."
          ]}
        />
        <Meta>{summarise(live.length, latest)}</Meta>
      </Inner>
    </HeroContainer>
  );
};

export default Hero;
