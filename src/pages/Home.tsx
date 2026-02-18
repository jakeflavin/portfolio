import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import Card from "../components/core/Card";
import Hero from "../components/composits/Hero";
import InputAction from "../components/core/InputAction";
import { PROJECTS } from "./data/projects";
import type { Project } from "./data/projects";
import SearchIcon from "@/assets/icons/magnifying-glass.svg?react";
import Select from "../components/core/Select";

const SORT_OPTIONS = [
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
  { value: "date-asc", label: "Oldest" },
  { value: "date-desc", label: "Newest" }
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/** Returns a new sorted array of projects by the given sort option. */
function sortProjects(projects: Project[], sortBy: SortValue): Project[] {
  const copy = [...projects];
  switch (sortBy) {
    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case "date-asc":
      return copy.sort(
        (a, b) =>
          a.creationDate.getTime() - b.creationDate.getTime()
      );
    case "date-desc":
      return copy.sort(
        (a, b) =>
          b.creationDate.getTime() - a.creationDate.getTime()
      );
    default:
      return copy;
  }
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortValue>("date-desc");

  const filteredAndSortedProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? PROJECTS.filter(
          (project) =>
            project.disabled === false &&
            (project.title.toLowerCase().includes(query) ||
              project.description.toLowerCase().includes(query) ||
              (project.tags?.some((tag) =>
                tag.toLowerCase().includes(query)
              ) ?? false))
        )
      : PROJECTS.filter((project) => project.disabled === false);
    return sortProjects(filtered, sortBy);
  }, [searchQuery, sortBy]);

  return (
    <>
      <Hero />
      <SearchContainer>
        <InputAction
          icon={<SearchIcon />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a project..."
        />
        <SelectWrap>
          <Select
            options={[...SORT_OPTIONS]}
            placeholder="Sort by"
            value={sortBy}
            onChange={(v) => setSortBy(v as SortValue)}
            aria-label="Sort projects"
          />
        </SelectWrap>
      </SearchContainer>
      <CardContainer>
        {filteredAndSortedProjects.map((project) => (
          <Card
            key={project.id}
            title={project.title}
            type={project.type}
            imageSrc={project.imageSrc}
            description={project.description}
            tags={project.tags}
            onAction={() =>
              project.external
                ? window.open(project.path, "_blank", "noopener,noreferrer")
                : navigate(project.path)
            }
          />
        ))}
      </CardContainer>
    </>
  );
};

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: row;
  align-items: stretch;
`;

const SelectWrap = styled.div`
  align-self: stretch;
  display: flex;
  min-height: 0;
`;

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
