import React, { useEffect, useMemo, useState } from "react";
import { styled } from "styled-components";
import { Project } from "../data/projects";
import TitleDescription from "../../components/core/TitleDescription";
import Link from "../../components/core/Link";
import NumberedList from "../../components/core/NumberedList";
import InputAction from "../../components/core/InputAction";
import Select from "../../components/core/Select";
import Button from "../../components/core/Button";
import DynamicColumnLayout from "../../components/core/DynamicColumnLayout";
import { addCoolLink, subscribeCoolLinks, type CoolLink } from "../../lib/coolLinksDb";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  CATEGORY_ORDER
} from "../data/coolLinkCategories";

interface CoolLinksPageProps {
  project: Project;
}

/** Per-field validation errors for the add-link form. */
export interface FormErrors {
  title?: string;
  url?: string;
  category?: string;
}

/** Valid HTTPS URL with host (e.g. https://www.google.com). */
function isValidHttpsUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "https:") return false;
    if (!u.hostname || u.hostname.length < 2) return false;
    return true;
  } catch {
    return false;
  }
}

/** Validates add-link form fields; returns an object of field keys to error messages. */
function validateForm(title: string, url: string, category: string): FormErrors {
  const errors: FormErrors = {};
  const trimmedTitle = title.trim();
  const trimmedUrl = url.trim();
  const trimmedCategory = category.trim();

  if (!trimmedTitle) {
    errors.title = "Name is required.";
  }

  if (!trimmedUrl) {
    errors.url = "URL is required.";
  } else if (!isValidHttpsUrl(trimmedUrl)) {
    errors.url = "URL must be a valid HTTPS address (e.g. https://www.google.com).";
  }

  if (!trimmedCategory) {
    errors.category = "Please select a category.";
  } else if (!CATEGORY_OPTIONS.some((opt) => opt.value === trimmedCategory)) {
    errors.category = "Please select a valid category.";
  }

  return errors;
}

/** Groups cool links by category key (known category or "uncategorized"). */
function groupLinksByCategory(links: CoolLink[]): Map<string, CoolLink[]> {
  const map = new Map<string, CoolLink[]>();
  const known = new Set(CATEGORY_ORDER);
  for (const link of links) {
    const key = !link.category
      ? "uncategorized"
      : known.has(link.category as (typeof CATEGORY_ORDER)[number])
        ? link.category
        : "uncategorized";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(link);
  }
  return map;
}

/**
 * Returns the initial visible count for a category list (truncate threshold).
 * Under 3 show all; 3–5 show 3; 6–11 show 6; 12–17 show 12; 18+ show 18.
 */
function getTruncateLength(listLength: number): number {
  if (listLength >= 18) return  18;
  if (listLength >= 12) return  12;
  if (listLength >= 6) return 6;
  if (listLength >= 3) return 3;
  return listLength;
}

const CoolLinksPage: React.FC<CoolLinksPageProps> = ({ project }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [links, setLinks] = useState<CoolLink[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeCoolLinks(setLinks);
    return unsubscribe;
  }, []);

  const linksByCategory = useMemo(() => groupLinksByCategory(links), [links]);

  const isFormComplete =
    title.trim() !== "" && url.trim() !== "" && category.trim() !== "";

  const handleAdd = async () => {
    setError(null);
    setFormErrors({});
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    const trimmedCategory = category.trim();

    const errors = validateForm(title, url, category);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const categoryDescription = CATEGORY_DESCRIPTIONS[trimmedCategory] ?? null;
    setIsSubmitting(true);
    try {
      await addCoolLink({
        title: trimmedTitle,
        url: trimmedUrl,
        category: trimmedCategory,
        categoryDescription
      });
      setTitle("");
      setUrl("");
      setCategory("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DynamicColumnLayout>
      <MetaContainer>
        <TitleDescription title={project.title} description={project.description} />
        <AddRow>
          <InputAction
            label="Name"
            placeholder="Google"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setFormErrors((prev) => ({ ...prev, title: undefined }));
            }}
            error={formErrors.title}
          />
          <InputAction
            label="URL"
            placeholder="https://www.google.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setFormErrors((prev) => ({ ...prev, url: undefined }));
            }}
            error={formErrors.url}
          />
          <AddActionsRow>
            <SelectWrap>
              <Select
                options={CATEGORY_OPTIONS}
                placeholder="Select a category"
                value={category}
                onChange={(v) => {
                  setCategory(v);
                  setFormErrors((prev) => ({ ...prev, category: undefined }));
                }}
                aria-label="Category"
                error={formErrors.category}
              />
            </SelectWrap>
            <AddButtonWrap>
              <Button
                onClick={handleAdd}
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

const AddRow = styled.div`
  --input-label-bg-top: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.mdDown};
`;

const AddActionsRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AddButtonWrap = styled.div`
  flex: 1;
  min-width: 0;

  & > button {
    width: 100%;
  }
`;

const AddError = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const SelectWrap = styled.div`
  display: flex;
  align-self: stretch;
  min-height: 0;
`;

const MetaContainer = styled.div`
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

export default CoolLinksPage;