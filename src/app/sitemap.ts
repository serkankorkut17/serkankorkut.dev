import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
