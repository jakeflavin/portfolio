import { useEffect, useMemo, useState } from "react";
import { addCoolLink, subscribeCoolLinks, type CoolLink } from "./coolLinksDb";
import {
  getCategoryDescription,
  groupLinksByCategory,
  validateForm,
  type FormErrors
} from "./coolLinks.utils";

export function useCoolLinks() {
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
  const isFormComplete = title.trim() !== "" && url.trim() !== "" && category.trim() !== "";

  const updateTitle = (value: string) => {
    setTitle(value);
    setFormErrors((prev) => ({ ...prev, title: undefined }));
  };

  const updateUrl = (value: string) => {
    setUrl(value);
    setFormErrors((prev) => ({ ...prev, url: undefined }));
  };

  const updateCategory = (value: string) => {
    setCategory(value);
    setFormErrors((prev) => ({ ...prev, category: undefined }));
  };

  const addLink = async () => {
    setError(null);
    setFormErrors({});

    const errors = validateForm(title, url, category);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    const trimmedCategory = category.trim();

    setIsSubmitting(true);
    try {
      await addCoolLink({
        title: trimmedTitle,
        url: trimmedUrl,
        category: trimmedCategory,
        categoryDescription: getCategoryDescription(trimmedCategory)
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

  return {
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
  };
}
