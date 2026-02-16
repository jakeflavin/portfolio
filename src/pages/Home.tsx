import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Card from "../components/core/Card";
import Hero from "../components/composits/Hero";
import InputAction from "../components/core/InputAction";
import { PROJECTS } from "./projects";
import SearchIcon from "@/assets/icons/magnifying-glass.svg?react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return PROJECTS;
    return PROJECTS.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        (project.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false)
    );
  }, [searchQuery]);

  return (
    <>
      <Hero />
      <InputAction
        icon={<SearchIcon />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a project..."
      />
      <CardContainer>
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            title={project.title}
            type={project.type}
            imageSrc={project.imageSrc}
            description={project.description}
            tags={project.tags}
            onAction={() => navigate(project.path)}
          />
        ))}
      </CardContainer>
    </>
  );
};

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.media.md} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export default Home;
