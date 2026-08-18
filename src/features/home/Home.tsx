import React from "react";
import Card from "@/ui/Card";
import InputAction from "@/ui/InputAction";
import { PROJECTS } from "@/features/projects/projects";
import { Search } from "lucide-react";
import Select from "@/ui/Select";
import ProfileHeader from "@/features/layout/ProfileHeader";
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

export interface HomeProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Home: React.FC<HomeProps> = ({ isDarkMode, onToggleDarkMode }) => {
  const { searchQuery, setSearchQuery, sortBy, setSortBy, visibleProjects } =
    useProjectSearch(PROJECTS);

  return (
    <>
      <ProfileHeader isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
      <SearchContainer>
        <InputAction
          icon={<Search size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          bare
        />
        <SelectWrap>
          <Select
            options={[...SORT_OPTIONS]}
            placeholder="Sort by"
            value={sortBy}
            onChange={(v) => setSortBy(v as SortValue)}
            aria-label="Sort projects"
            bare
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
              date={project.creationDate}
              repo={project.repo}
              onTagClick={setSearchQuery}
            />
          ))}
        </CardContainer>
      )}
    </>
  );
};

export default Home;
