import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/ui/Card";
import Hero from "@/features/layout/Hero";
import InputAction from "@/ui/InputAction";
import { PROJECTS } from "@/features/projects/projects";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Select from "@/ui/Select";
import { CardContainer, SearchContainer, SelectWrap } from "./Home.styled";
import { SORT_OPTIONS, type SortValue } from "./home.utils";
import { useProjectSearch } from "./useProjectSearch";

const Home: React.FC = () => {
  const navigate = useNavigate();
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
      <CardContainer>
        {visibleProjects.map((project) => (
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

export default Home;
