import type { CardType } from "@/ui/Card";
import appsManifest from "../../../apps.json";

/**
 * One entry in the directory. Every project is a standalone app deployed into
 * `/<slug>/` on this same Hosting site; the portfolio only links to it.
 */
export interface Project {
  id: string;
  creationDate: Date;
  disabled: boolean;
  title: string;
  type: CardType;
  imageSrc: string;
  description: string;
  tags?: string[];
  /** Public path this app is served from, e.g. `/countdown/` */
  path: string;
  /** GitHub repo the build artifact is published from, e.g. `jakeflavin/countdown` */
  repo: string;
}

export interface AppRecord {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  cover: string;
  creationDate: string;
  disabled: boolean;
  repo: string;
  /** Pins a specific release tag. Omit to take the latest build at deploy time. */
  ref?: string;
}

export const APPS: AppRecord[] = (appsManifest as { apps: AppRecord[] }).apps;

export const PROJECTS: Project[] = APPS.map((app) => ({
  id: app.slug,
  creationDate: new Date(app.creationDate),
  disabled: app.disabled,
  title: app.title,
  type: "project" as CardType,
  imageSrc: app.cover,
  description: app.description,
  tags: app.tags,
  path: `/${app.slug}/`,
  repo: app.repo
}));
