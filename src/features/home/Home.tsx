import React from "react";
import Card from "@/ui/Card";
import Hero from "@/features/layout/Hero";
import InputAction from "@/ui/InputAction";
import { PROJECTS } from "@/features/projects/projects";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Select from "@/ui/Select";
import {
  CardContainer,
  SearchContainer,
  SelectWrap,
  EmptyState,
  EmptyTitle,
  EmptyHint
} from "./Home.styled";
import { SORT_OPTIONS, type SortValue } from "./home.utils";
import { useProjectSearch } from "./useProjectSearch";

const Home: React.FC = () => {
  const { searchQuery, setSearchQuery, sortBy, setSortBy, visibleProjects } =
    useProjectSearch(PROJECTS);

  return (
    <>
      <Hero />
      <SearchContainer>
        <InputAction
          icon={<MagnifyingGlassIcon size={16} />}
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
      {visibleProjects.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No projects found</EmptyTitle>
          <EmptyHint>
            Nothing matches &ldquo;{searchQuery.trim()}&rdquo;. Try a different word, or clear
            the search.
          </EmptyHint>
        </EmptyState>
      ) : (
        <CardContainer>
          {visibleProjects.map((project) => (
            <Card
              key={project.id}
              title={project.title}
              type={project.type}
              imageSrc={project.imageSrc}
              description={project.description}
              tags={project.tags}
              href={project.path}
              disabled={project.disabled}
            />
          ))}
        </CardContainer>
      )}
    </>
  );
};

export default Home;
