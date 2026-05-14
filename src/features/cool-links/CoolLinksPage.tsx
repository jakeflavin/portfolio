import React from "react";
import { Project } from "@/features/projects/projects";
import TitleDescription from "@/ui/TitleDescription";
import Link from "@/ui/Link";
import NumberedList from "@/ui/NumberedList";
import InputAction from "@/ui/InputAction";
import Select from "@/ui/Select";
import Button from "@/ui/Button";
import DynamicColumnLayout from "@/ui/DynamicColumnLayout";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  CATEGORY_ORDER
} from "./coolLinkCategories";
import {
  AddActionsRow,
  AddButtonWrap,
  AddError,
  AddRow,
  MetaContainer,
  SelectWrap
} from "./CoolLinksPage.styled";
import { getTruncateLength } from "./coolLinks.utils";
import { useCoolLinks } from "./useCoolLinks";

export interface CoolLinksPageProps {
  project: Project;
}

const CoolLinksPage: React.FC<CoolLinksPageProps> = ({ project }) => {
  const {
    addLink,
    category,
    error,
    formErrors,
    isFormComplete,
    isSubmitting,
    linksByCategory,
    title,
    updateCategory,
    updateTitle,
    updateUrl,
    url
  } = useCoolLinks();

  return (
    <DynamicColumnLayout>
      <MetaContainer>
        <TitleDescription title={project.title} description={project.description} />
        <AddRow padding="md" variant="secondary" shadow="mdDown">
          <InputAction
            label="Name"
            placeholder="Google"
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            error={formErrors.title}
          />
          <InputAction
            label="URL"
            placeholder="https://www.google.com"
            value={url}
            onChange={(e) => updateUrl(e.target.value)}
            error={formErrors.url}
          />
          <AddActionsRow>
            <SelectWrap>
              <Select
                options={CATEGORY_OPTIONS}
                placeholder="Select a category"
                value={category}
                onChange={updateCategory}
                aria-label="Category"
                error={formErrors.category}
              />
            </SelectWrap>
            <AddButtonWrap>
              <Button
                onClick={addLink}
                disabled={!isFormComplete || isSubmitting}
              >
                {isSubmitting ? "Adding…" : "Add"}
              </Button>
            </AddButtonWrap>
          </AddActionsRow>
          {error && <AddError>{error}</AddError>}
        </AddRow>
      </MetaContainer>
      {CATEGORY_ORDER.map((categoryKey) => {
        const categoryLinks = linksByCategory.get(categoryKey);
        if (!categoryLinks?.length) return null;
        return (
          <NumberedList
            key={categoryKey}
            title={CATEGORY_LABELS[categoryKey]}
            description={CATEGORY_DESCRIPTIONS[categoryKey]}
            truncate={getTruncateLength(categoryLinks.length)}
          >
            {categoryLinks.map((link) => (
              <Link key={link.id} title={link.title} url={link.url} openInNewTab />
            ))}
          </NumberedList>
        );
      })}
    </DynamicColumnLayout>
  );
};

export default CoolLinksPage;
