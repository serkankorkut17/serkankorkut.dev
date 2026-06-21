# Projects Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the real, image-rich `src/data/projects.json` into a comprehensive Projects experience — an index that links to per-project detail pages with screenshot galleries, source links, and prev/next navigation.

**Architecture:** `projects.json` becomes the single canonical data source (enriched with slug/n/year/featured/kind/stack/liveUrl). A typed access layer (`src/lib/projects.ts`) feeds the index section, a new dynamic detail route (`/projects/[slug]`), and the home FeaturedWork section. Detail pages are statically generated server components; gallery + lightbox are custom client components. `ProjectsData.json` and `FeaturedData.json` are removed.

**Tech Stack:** Next.js 16 (App Router, `params` is a Promise), React 19, Tailwind v4, next-intl v4, next/image. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-06-21-projects-showcase-design.md`

---

## Verification note (no test infra)

This project has **no test runner** (jest/playwright not installed) — adding one is out of scope (per spec §8). TDD steps are therefore replaced with **typecheck + lint + build + manual** verification, keeping frequent commits:

- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint`
- Build (exercises static generation): `npm run build`
- Manual: `npm run dev`, then visit the URLs noted per task.

`src/lib/projects.ts` is kept pure so unit tests can be added later without refactoring.

## File structure

| File | Responsibility |
|------|----------------|
| `src/data/projects.json` (modify) | Single canonical project dataset |
| `src/lib/projects.ts` (create) | Types + pure accessors (`getAllProjects`, `getProjectBySlug`, `getFeaturedProjects`, `getAdjacent`) |
| `messages/en.json`, `messages/tr.json` (modify) | Add `ProjectDetail.*` keys; remove unused `Projects.media` |
| `src/components/sections/Projects.tsx` (rewrite) | Index table; rows link to detail pages |
| `src/components/sections/FeaturedWork.tsx` (rewrite) | 3 featured projects with cover images |
| `src/components/projects/ProjectMeta.tsx` (create) | year · kind · stack chips + GitHub/Live buttons |
| `src/components/projects/Lightbox.tsx` (create) | Fullscreen image overlay (←/→/Esc, counter) |
| `src/components/projects/ProjectGallery.tsx` (create) | Main image + thumbnail strip, opens Lightbox |
| `src/components/projects/ProjectNav.tsx` (create) | prev / next links |
| `src/app/projects/[slug]/page.tsx` (create) | Detail route: static params, metadata, compose |
| `src/data/ProjectsData.json`, `src/data/FeaturedData.json` (delete) | Dead after rewire |

---

## Task 1: Enrich `projects.json` into the canonical dataset

Add `slug/n/year/featured/kind/stack/liveUrl` to each of the 10 projects while preserving `title`/`description`/`githubUrl`/`images` verbatim. Done via a one-shot script (avoids hand-copying long bilingual text), then the script is deleted.

**Files:**
- Create (temporary): `scripts/enrich-projects.mjs`
- Modify: `src/data/projects.json`

- [ ] **Step 1: Write the one-shot enrichment script**

Create `scripts/enrich-projects.mjs`:

```js
import { readFileSync, writeFileSync } from "node:fs";

const PATH = "src/data/projects.json";
const src = JSON.parse(readFileSync(PATH, "utf8"));

// slug (= image folder) -> derived metadata. Owner verifies/edits afterward.
const META = {
  "fastapi-graphql":       { n: "01", year: "2024", featured: true,  kind: { en: "Backend · API",         tr: "Backend · API" },         stack: ["Python", "FastAPI", "GraphQL", "SQLAlchemy", "JWT"] },
  "nodejs-backend":        { n: "02", year: "2023", featured: false, kind: { en: "Backend · Full-stack",   tr: "Backend · Full-stack" },   stack: ["Node.js", "Express", "MongoDB", "EJS"] },
  "leave-master-backend":  { n: "03", year: "2024", featured: false, kind: { en: "Backend · API",         tr: "Backend · API" },         stack: ["ASP.NET Core", "C#", "MongoDB", "JWT", "Swagger"] },
  "leave-master-frontend": { n: "04", year: "2024", featured: true,  kind: { en: "Frontend · Web",        tr: "Frontend · Web" },        stack: ["React", "React Router"] },
  "invoice-payment":       { n: "05", year: "2023", featured: true,  kind: { en: "Frontend · Fintech",    tr: "Frontend · Fintech" },    stack: ["Next.js", "React"] },
  "texture-mapping":       { n: "06", year: "2023", featured: false, kind: { en: "Graphics · Academic",   tr: "Grafik · Akademik" },     stack: ["C++", "SDL", "GLM", "OpenGL"] },
  "socket-programming":    { n: "07", year: "2023", featured: false, kind: { en: "Networking · Academic", tr: "Ağ · Akademik" },         stack: ["Python", "Sockets", "TCP/UDP", "HTTP"] },
  "mssql-database":        { n: "08", year: "2023", featured: false, kind: { en: "Database · Academic",   tr: "Veritabanı · Akademik" }, stack: ["MSSQL", "T-SQL"] },
  "robotics":              { n: "09", year: "2022", featured: false, kind: { en: "Robotics · Academic",   tr: "Robotik · Akademik" },    stack: ["Python", "NumPy", "3D Sim"] },
  "student-registration":  { n: "10", year: "2022", featured: false, kind: { en: "OOP · Academic",        tr: "OOP · Akademik" },        stack: ["Java", "Python", "JSON"] },
};

const projects = src.projects.map((p) => {
  const slug = p.images[0].split("/")[2]; // "/projects/<slug>/file.webp"
  const m = META[slug];
  if (!m) throw new Error(`No metadata mapping for slug: ${slug}`);
  return {
    slug,
    n: m.n,
    year: m.year,
    featured: m.featured,
    title: p.title,
    kind: m.kind,
    stack: m.stack,
    githubUrl: p.githubUrl,
    liveUrl: null,
    description: p.description,
    images: p.images,
  };
});

writeFileSync(PATH, JSON.stringify({ projects }, null, 2) + "\n");
console.log(`Enriched ${projects.length} projects`);
```

- [ ] **Step 2: Run the script**

Run: `node scripts/enrich-projects.mjs`
Expected: `Enriched 10 projects`

- [ ] **Step 3: Verify the result is valid and shaped correctly**

Run:
```bash
node -e "const d=require('./src/data/projects.json');console.log(d.projects.length, d.projects[0].slug, d.projects[0].n, d.projects.filter(p=>p.featured).length)"
```
Expected: `10 fastapi-graphql 01 3`

- [ ] **Step 4: Delete the one-shot script**

Run: `rm scripts/enrich-projects.mjs`

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.json
git commit -m "feat(projects): enrich projects.json into canonical dataset"
```

---

## Task 2: Typed access layer `src/lib/projects.ts`

**Files:**
- Create: `src/lib/projects.ts`

- [ ] **Step 1: Write the module**

Create `src/lib/projects.ts`:

```ts
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/projects.ts
git commit -m "feat(projects): add typed project access layer"
```

---

## Task 3: i18n keys

Add `ProjectDetail` block to both locale files; remove the now-unused `Projects.media` key.

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/tr.json`

- [ ] **Step 1: Edit `messages/en.json`**

In the `"Projects"` object, delete the `"media": "[ PROJECT MEDIA ]"` line (and fix the trailing comma on the preceding line). Then add a new top-level block (sibling of `"Projects"`):

```json
  "ProjectDetail": {
    "backToProjects": "All projects",
    "screenshots": "Screenshots",
    "viewSource": "View source",
    "liveDemo": "Live demo",
    "noLive": "No live demo",
    "previous": "Prev",
    "next": "Next"
  },
```

- [ ] **Step 2: Edit `messages/tr.json`**

In the `"Projects"` object, delete the `"media"` line (fix the trailing comma). Add the sibling block:

```json
  "ProjectDetail": {
    "backToProjects": "Tüm projeler",
    "screenshots": "Ekran görüntüleri",
    "viewSource": "Kaynak kod",
    "liveDemo": "Canlı demo",
    "noLive": "Canlı demo yok",
    "previous": "Önceki",
    "next": "Sonraki"
  },
```

- [ ] **Step 3: Verify both JSON files parse**

Run:
```bash
node -e "require('./messages/en.json');require('./messages/tr.json');console.log('ok')"
```
Expected: `ok`

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/tr.json
git commit -m "feat(i18n): add ProjectDetail keys, drop unused Projects.media"
```

---

## Task 4: Rewrite the Projects index section

Rows become links to `/projects/[slug]`, show the real `stack`, and drop the accordion + theme MutationObserver + placeholder media box.

**Files:**
- Rewrite: `src/components/sections/Projects.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { getAllProjects, type Locale } from "@/lib/projects";

export default function Projects() {
  const t = useTranslations("Projects");
  const locale = useLocale() as Locale;
  const projects = getAllProjects();

  return (
    <section className="bg-term-bg text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-12 items-end">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-4">
              {t("tag")}
            </div>
            <h2 className="font-display text-[40px] md:text-[56px] leading-none font-[800] tracking-[-0.03em] m-0 text-term-fg">
              {t("title")}
            </h2>
          </div>
          <p className="text-base text-term-fg-muted m-0 max-w-[480px] md:justify-self-end">
            {t("sub")}
          </p>
        </div>

        {/* Index table */}
        <div className="border border-term-border rounded-md overflow-hidden bg-term-bg-elevated">
          <div className="hidden md:grid grid-cols-[60px_1fr_1.4fr_1.6fr_80px] px-6 py-3 border-b border-term-border bg-term-bg-inset text-[11px] text-term-fg-faint tracking-[0.1em]">
            <div>{t("col1")}</div>
            <div>{t("col2")}</div>
            <div>{t("col3")}</div>
            <div>{t("col4")}</div>
            <div className="text-right">{t("col5")}</div>
          </div>

          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className={cn(
                "group flex flex-col md:grid md:grid-cols-[60px_1fr_1.4fr_1.6fr_80px] px-6 py-5 items-start md:items-center gap-4 no-underline text-term-fg transition-colors hover:bg-term-bg-inset",
                i < projects.length - 1 ? "border-b border-term-border" : ""
              )}
            >
              <div className="flex w-full md:contents">
                <div className="text-term-accent text-[13px] font-[700] w-16 md:w-auto">
                  {p.n}
                </div>
                <div className="text-term-fg-muted text-[13px] w-20 md:w-auto">
                  {p.year}
                </div>
                <div className="flex-1 md:contents">
                  <div className="md:w-full">
                    <div className="text-[16px] font-[600] text-term-fg">
                      {p.title[locale]}
                    </div>
                    <div className="text-[12px] text-term-fg-faint mt-0.5">
                      {p.kind[locale]}
                    </div>
                  </div>
                </div>
                <div className="text-right text-term-accent text-[16px] ml-auto md:hidden transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                  →
                </div>
              </div>

              <div className="hidden md:flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] px-2 py-0.5 border border-term-border rounded-[3px] text-term-fg-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="hidden md:block text-right text-term-accent text-[16px] transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Projects.tsx
git commit -m "feat(projects): index rows link to detail pages with real stack"
```

---

## Task 5: `ProjectMeta` component

**Files:**
- Create: `src/components/projects/ProjectMeta.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import type { Project, Locale } from "@/lib/projects";

interface ProjectMetaProps {
  project: Project;
}

export default function ProjectMeta({ project }: ProjectMetaProps) {
  const t = useTranslations("ProjectDetail");
  const locale = useLocale() as Locale;

  return (
    <div className="flex flex-col gap-5 mb-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-term-fg-muted">
        <span className="text-term-fg-faint">{project.year}</span>
        <span className="text-term-fg-faint">/</span>
        <span>{project.kind[locale]}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="text-[11px] px-2 py-0.5 border border-term-border rounded-[3px] text-term-fg-muted"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-term-accent text-black border-none px-[18px] py-[11px] font-mono text-[13px] font-[700] rounded-[3px] flex items-center gap-2 hover:opacity-90 transition-opacity motion-reduce:transition-none no-underline"
        >
          {t("viewSource")} <span className="opacity-70">→</span>
        </a>
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent text-term-fg border border-term-border px-[18px] py-[11px] font-mono text-[13px] rounded-[3px] flex items-center gap-2 hover:border-term-accent hover:text-term-accent transition-colors motion-reduce:transition-none no-underline"
          >
            {t("liveDemo")} <span>↗</span>
          </a>
        ) : (
          <span className="px-[18px] py-[11px] font-mono text-[13px] text-term-fg-faint border border-dashed border-term-border rounded-[3px]">
            {t("noLive")}
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectMeta.tsx
git commit -m "feat(projects): add ProjectMeta component"
```

---

## Task 6: `Lightbox` component

**Files:**
- Create: `src/components/projects/Lightbox.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

interface LightboxProps {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function Lightbox({
  images,
  index,
  alt,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const prev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const next = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center font-mono"
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-9 h-9 bg-transparent border border-term-border text-term-fg-muted rounded cursor-pointer flex items-center justify-center text-sm hover:text-term-accent hover:border-term-accent transition-colors motion-reduce:transition-none z-10"
      >
        ✕
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-4 text-[12px] text-term-fg-muted z-10">
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous image"
          className="absolute left-3 md:left-6 w-10 h-10 bg-transparent border border-term-border text-term-fg-muted rounded cursor-pointer flex items-center justify-center text-lg hover:text-term-accent hover:border-term-accent transition-colors motion-reduce:transition-none z-10"
        >
          ←
        </button>
      )}

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90vw] h-[82vh]"
      >
        <Image
          src={images[index]}
          alt={`${alt} — ${index + 1}`}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next image"
          className="absolute right-3 md:right-6 w-10 h-10 bg-transparent border border-term-border text-term-fg-muted rounded cursor-pointer flex items-center justify-center text-lg hover:text-term-accent hover:border-term-accent transition-colors motion-reduce:transition-none z-10"
        >
          →
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/Lightbox.tsx
git commit -m "feat(projects): add Lightbox component"
```

---

## Task 7: `ProjectGallery` component

**Files:**
- Create: `src/components/projects/ProjectGallery.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Lightbox from "./Lightbox";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const t = useTranslations("ProjectDetail");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  if (images.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3 uppercase">
        {t("screenshots")}
      </div>

      {/* Main image */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open image"
        className="relative w-full aspect-video rounded-md overflow-hidden border border-term-border bg-term-bg-inset cursor-pointer block group"
      >
        <Image
          src={images[active]}
          alt={`${title} — ${active + 1}`}
          fill
          sizes="(max-width: 1280px) 100vw, 1216px"
          className="object-contain"
          priority
        />
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "relative shrink-0 w-[112px] aspect-video rounded overflow-hidden border bg-term-bg-inset cursor-pointer transition-colors motion-reduce:transition-none",
                i === active
                  ? "border-term-accent"
                  : "border-term-border hover:border-term-fg-muted"
              )}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {open && (
        <Lightbox
          images={images}
          index={active}
          alt={title}
          onClose={() => setOpen(false)}
          onIndexChange={setActive}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectGallery.tsx
git commit -m "feat(projects): add ProjectGallery component"
```

---

## Task 8: `ProjectNav` component

**Files:**
- Create: `src/components/projects/ProjectNav.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { Project, Locale } from "@/lib/projects";

interface ProjectNavProps {
  prev: Project | null;
  next: Project | null;
}

export default function ProjectNav({ prev, next }: ProjectNavProps) {
  const t = useTranslations("ProjectDetail");
  const locale = useLocale() as Locale;

  return (
    <nav className="mt-14 pt-6 border-t border-dashed border-term-border grid grid-cols-2 gap-4">
      <div>
        {prev && (
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex flex-col gap-1 no-underline text-term-fg"
          >
            <span className="text-[11px] text-term-fg-faint tracking-[0.1em]">
              ← {t("previous")}
            </span>
            <span className="text-[14px] font-[600] text-term-fg-muted group-hover:text-term-accent transition-colors motion-reduce:transition-none">
              {prev.title[locale]}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            className="group flex flex-col gap-1 no-underline text-term-fg items-end"
          >
            <span className="text-[11px] text-term-fg-faint tracking-[0.1em]">
              {t("next")} →
            </span>
            <span className="text-[14px] font-[600] text-term-fg-muted group-hover:text-term-accent transition-colors motion-reduce:transition-none">
              {next.title[locale]}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/ProjectNav.tsx
git commit -m "feat(projects): add ProjectNav component"
```

---

## Task 9: Detail route `/projects/[slug]`

Server component: static params for all 10, per-project metadata (OG = cover image), `notFound()` for unknown slugs, compose Meta + Gallery + description + Nav. Also add `metadataBase` to the root layout so OG image URLs resolve absolutely.

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`
- Modify: `src/app/layout.tsx` (add `metadataBase`)

- [ ] **Step 1: Add `metadataBase` to the root layout metadata**

In `src/app/layout.tsx`, replace the existing `metadata` export:

```tsx
export const metadata: Metadata = {
	title: "Serkan Korkut",
	description: "Welcome to my personal website",
};
```

with:

```tsx
export const metadata: Metadata = {
	metadataBase: new URL("https://serkankorkut.dev"),
	title: "Serkan Korkut",
	description: "Welcome to my personal website",
};
```

- [ ] **Step 2: Write the detail page**

Create `src/app/projects/[slug]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import {
  getAllProjects,
  getProjectBySlug,
  getAdjacent,
  type Locale,
} from "@/lib/projects";
import ProjectMeta from "@/components/projects/ProjectMeta";
import ProjectGallery from "@/components/projects/ProjectGallery";
import ProjectNav from "@/components/projects/ProjectNav";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const locale = (await getLocale()) as Locale;
  return {
    title: `${project.title[locale]} · Serkan Korkut`,
    description: project.description[locale],
    openGraph: {
      title: project.title[locale],
      description: project.description[locale],
      images: project.images.length ? [project.images[0]] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("ProjectDetail");
  const { prev, next } = getAdjacent(slug);

  return (
    <section className="bg-term-bg text-term-fg font-mono py-16 md:py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[12px] text-term-fg-muted hover:text-term-accent transition-colors motion-reduce:transition-none no-underline mb-10"
        >
          ← {t("backToProjects")}
        </Link>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-term-accent text-[14px] font-[700]">
            {project.n}
          </span>
          <h1 className="font-display text-[36px] md:text-[56px] leading-[1.05] font-[800] tracking-[-0.03em] m-0 text-term-fg">
            {project.title[locale]}
          </h1>
        </div>

        <ProjectMeta project={project} />
        <ProjectGallery images={project.images} title={project.title[locale]} />

        <p className="m-0 text-[15px] leading-[1.75] text-term-fg-muted max-w-[760px]">
          {project.description[locale]}
        </p>

        <ProjectNav prev={prev} next={next} />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Build to verify static generation of all 10 detail pages**

Run: `npm run build`
Expected: build succeeds; output lists `/projects/[slug]` prerendered as 10 static pages (`● (SSG)` / `Generating static pages (.../...)`).

- [ ] **Step 4: Commit**

```bash
git add "src/app/projects/[slug]/page.tsx" src/app/layout.tsx
git commit -m "feat(projects): add static [slug] detail route with metadata"
```

---

## Task 10: Rewrite FeaturedWork (home) with cover images

**Files:**
- Rewrite: `src/components/sections/FeaturedWork.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getFeaturedProjects, type Locale } from "@/lib/projects";

export default function FeaturedWork() {
  const t = useTranslations("FeaturedWork");
  const locale = useLocale() as Locale;
  const featured = getFeaturedProjects(3);

  return (
    <section className="bg-term-bg text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-6">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3 uppercase">
              {t("tag")}
            </div>
            <h2 className="font-display text-[40px] md:text-[48px] font-[800] tracking-[-0.03em] m-0 leading-none text-term-fg">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/projects"
            className="bg-transparent border border-term-border text-term-fg px-4 py-2.5 font-mono text-xs rounded flex items-center gap-2 hover:border-term-accent hover:text-term-accent transition-colors motion-reduce:transition-none w-fit no-underline"
          >
            <span>{t("viewAll")}</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group font-mono bg-term-bg-elevated border border-term-border rounded-md overflow-hidden flex flex-col text-term-fg hover:border-term-accent transition-colors motion-reduce:transition-none no-underline"
            >
              <div className="relative w-full aspect-video bg-term-bg-inset border-b border-term-border overflow-hidden">
                <Image
                  src={p.images[0]}
                  alt={p.title[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex justify-between items-baseline text-[11px] text-term-fg-faint tracking-[0.15em]">
                  <span className="text-term-accent font-[700]">{p.n}</span>
                  <span>{p.year}</span>
                </div>
                <div className="font-display text-[20px] font-[700] tracking-[-0.01em] text-term-fg leading-[1.15]">
                  {p.title[locale]}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-term-border text-[11px] text-term-fg-muted mt-auto">
                  <span>{p.stack.join(" · ")}</span>
                  <span className="text-term-accent transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/FeaturedWork.tsx
git commit -m "feat(projects): featured cards use covers and link to detail pages"
```

---

## Task 11: Delete dead data files

**Files:**
- Delete: `src/data/ProjectsData.json`
- Delete: `src/data/FeaturedData.json`

- [ ] **Step 1: Confirm no remaining references**

Run: `grep -rn "ProjectsData\|FeaturedData" src/`
Expected: no output (both were only used by the rewritten sections).

- [ ] **Step 2: Delete the files**

Run: `rm src/data/ProjectsData.json src/data/FeaturedData.json`

- [ ] **Step 3: Build to confirm nothing broke**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A src/data
git commit -m "chore(projects): remove dead ProjectsData/FeaturedData json"
```

---

## Task 12: Final verification pass

**Files:** none (verification only; commit only if a fix is needed)

- [ ] **Step 1: Clean build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed, no errors.

- [ ] **Step 2: Manual smoke test**

Run: `npm run dev`, then check:
- `/projects` — all 10 rows, real stack chips, each row links out.
- `/projects/fastapi-graphql` — heading, meta, gallery (3 shots), GitHub button, description, prev/next (prev empty, next = nodejs-backend).
- Click main image → lightbox opens; ←/→ cycle; Esc closes; counter correct.
- `/projects/leave-master-frontend` — `liveUrl` is null → "No live demo" pill shows.
- Home FeaturedWork — 3 cards with cover images linking to detail pages.
- Toggle dark/light — gallery, lightbox, chips all themed correctly.
- Toggle EN/TR — titles, kind, button labels, prev/next labels switch.
- Visit `/projects/does-not-exist` → 404 (dynamicParams=false).

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix(projects): address issues from final verification"
```

(Skip if nothing needed fixing.)

---

## Self-review (spec coverage)

- Spec §1 canonical data → Task 1 + 2. ✅
- Spec §2 pages (index link-out, [slug], generateStaticParams/Metadata/notFound) → Task 4 + 9. ✅
- Spec §3 components (Gallery/Lightbox/Meta/Nav) → Tasks 5–8. ✅
- Spec §4 custom gallery+lightbox, no deps → Tasks 6–7. ✅
- Spec §5 i18n keys, Featured rewire, delete dead json → Tasks 3, 10, 11. ✅
- Spec §6 theme constraints (term-* tokens, font-mono/display, light+dark, neutral overlay) → enforced in every component task + verified Task 12. ✅
- Spec §7 derived metadata → Task 1 META map (owner verifies). ✅
- Spec §8 out of scope (tests) → handled via verification note. ✅
- Acceptance criteria → Task 12 manual checklist. ✅

Type consistency: `Project`, `Locale`, `Localized` and the four accessors are defined once in Task 2 and used verbatim in Tasks 4–10. Prop interfaces (`ProjectMetaProps`, `LightboxProps`, `ProjectGalleryProps`, `ProjectNavProps`) match their call sites in Task 9 (`project`, `images`/`title`, `prev`/`next`). No placeholders.
