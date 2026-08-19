import React, { useRef } from "react";
import Card from "@/components/Card";
import InputAction from "@/components/InputAction";
import ViewToggle from "@/components/ViewToggle";
import { PROJECTS } from "@/lib/projects";
import { Search } from "lucide-react";
import Select from "@/components/Select";
import ProfileHeader from "@/components/ProfileHeader";
import { useDeployStatus, bySlug } from "@/hooks/useDeployStatus";
import {
  CardContainer,
  SearchContainer,
  SelectWrap,
  EmptyState,
  EmptyTitle,
  EmptyHint,
  Results
} from "./Home.styled";
import { SORT_OPTIONS, type SortValue, type ViewValue } from "@/lib/home.utils";
import { useProjectSearch } from "@/hooks/useProjectSearch";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import GridView from "./GridView";
import ListView from "./ListView";

export interface HomeProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Home: React.FC<HomeProps> = ({ isDarkMode, onToggleDarkMode }) => {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    view,
    setView,
    visibleProjects
  } = useProjectSearch(PROJECTS);

  const deployed = bySlug(useDeployStatus());

  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useKeyboardNav({
    searchRef,
    resultsRef,
    onClearSearch: () => setSearchQuery(""),
    hasSearch: searchQuery.trim().length > 0
  });

  return (
    <>
      <ProfileHeader isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
      <SearchContainer>
        <ViewToggle value={view} onChange={(next: ViewValue) => setView(next)} />
        <InputAction
          ref={searchRef}
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
        <Results ref={resultsRef}>
          {view === "grid" && <GridView projects={visibleProjects} />}
          {view === "list" && (
            <ListView projects={visibleProjects} deployed={deployed} />
          )}
          {view === "cards" && (
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
                  build={deployed.get(project.slug)?.tag}
                  pinned={deployed.get(project.slug)?.pinned}
                />
              ))}
            </CardContainer>
          )}
        </Results>
      )}
    </>
  );
};

export default Home;
