import React, { useEffect, useRef } from "react";
import type { Project } from "../../../pages/data/projects";

const SITE_TITLE = "Jake's Portfolio";

function absoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;
  if (path.startsWith("http")) return path;
  const base = import.meta.env.VITE_SITE_URL ?? window.location.origin;
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

export interface ProjectPageMetaProps {
  project: Project;
  children: React.ReactNode;
}

/**
 * Wraps a project page and sets document head meta tags for social sharing
 * (Open Graph and Twitter Card) using the project's imageSrc, title, and description.
 */
export const ProjectPageMeta: React.FC<ProjectPageMetaProps> = ({
  project,
  children
}) => {
  const addedRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const imageUrl = absoluteUrl(project.imageSrc);
    const pageUrl =
      typeof window !== "undefined"
        ? window.location.href
        : absoluteUrl(project.path);
    const title = `${project.title} | ${SITE_TITLE}`;
    const description = project.description ?? "";

    const tags: [string, string, string][] = [
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:image", imageUrl],
      ["property", "og:url", pageUrl],
      ["property", "og:type", "website"],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
      ["name", "twitter:image", imageUrl]
    ];

    document.title = title;

    const elements: HTMLElement[] = [];

    for (const [attr, key, content] of tags) {
      const el = document.querySelector(
        `meta[${attr}="${key}"]`
      ) as HTMLMetaElement | null;

      if (el) {
        el.setAttribute("content", content);
      } else {
        const meta = document.createElement("meta");
        if (attr === "property") {
          meta.setAttribute("property", key);
        } else {
          meta.setAttribute("name", key);
        }
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
        elements.push(meta);
      }
    }

    addedRef.current = elements;

    return () => {
      addedRef.current.forEach((el) => el.remove());
      addedRef.current = [];
      document.title = SITE_TITLE;
    };
  }, [project]);

  return <>{children}</>;
};

export default ProjectPageMeta;
