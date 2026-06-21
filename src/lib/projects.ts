import projectsData from "@/data/projects.json";

export type Locale = "en" | "tr";

export interface Localized {
  en: string;
  tr: string;
}

export interface Project {
  slug: string;
  n: string;
  year: string;
  featured: boolean;
  title: Localized;
  kind: Localized;
  stack: string[];
  githubUrl: string;
  liveUrl: string | null;
  description: Localized;
  images: string[];
}

interface ProjectsFile {
  projects: Project[];
}

const { projects } = projectsData as unknown as ProjectsFile;

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(limit = 3): Project[] {
  return projects.filter((p) => p.featured).slice(0, limit);
}

export function getAdjacent(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? projects[i - 1] : null,
    next: i < projects.length - 1 ? projects[i + 1] : null,
  };
}
