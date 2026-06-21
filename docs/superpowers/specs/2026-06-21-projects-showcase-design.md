# Projects Showcase — Design Spec

**Date:** 2026-06-21
**Branch:** `feat/projects-showcase`
**Status:** Approved (pending spec review)
**Extends:** `2026-05-03-portfolio-redesign-terminal-theme-design.md` (terminal/IDE theme)

## Goal

Make the Projects area comprehensive by wiring the real, image-rich data in
`src/data/projects.json` (10 projects, each with bilingual title/description,
`githubUrl`, and real `.webp` screenshots under `public/projects/*`).

Today the index (`src/components/sections/Projects.tsx`) reads the curated
`ProjectsData.json` and renders a striped **placeholder** box ("placeholder for
project media", per the redesign spec) instead of real screenshots. We replace
that with a real index → per-project detail pages with image galleries, source
links, and prev/next navigation.

## Decisions (locked)

1. **Structure:** index list + per-project detail pages at `/projects/[slug]`
   (gallery + lightbox, full description, GitHub/Live buttons, prev/next).
2. **Missing metadata:** `year` / `kind` / `stack` are absent from `projects.json`.
   They are **derived** here (best guess) and the owner corrects them in the data
   file. See the derivation table below.
3. **Theme:** reuse the existing terminal/IDE aesthetic — `--term-*` CSS tokens,
   `font-mono` / `font-display`, existing border/radius patterns, light + dark.
   **No new colors, no new design language, no new dependencies.**

## 1. Data model — single canonical source

`src/data/projects.json` becomes the single source of truth. After rewiring,
`ProjectsData.json` and `FeaturedData.json` are deleted (DRY).

Per-project schema:

```jsonc
{
  "slug": "fastapi-graphql",        // matches public/projects/<slug>/ → used in URL
  "n": "01",
  "year": "2024",
  "featured": true,                  // surfaced on the home FeaturedWork section
  "title":       { "en": "...", "tr": "..." },
  "kind":        { "en": "Backend · API", "tr": "Backend · API" },
  "stack":       ["Python", "FastAPI", "GraphQL"],
  "githubUrl":   "https://github.com/serkankorkut17/...",
  "liveUrl":     null,               // most are null; owner fills where a demo exists
  "description": { "en": "...", "tr": "..." },
  "images":      ["/projects/fastapi-graphql/fastapi-docs.webp", "..."]
}
```

Notes:
- `slug` is derived from the existing image folder name, so URLs and asset paths
  stay aligned.
- `images[0]` is treated as the cover (used for index/featured thumbnails and the
  OpenGraph image).
- Top-level `title`/`subtitle`/`tag` strings stay in `messages/*.json` (i18n), not
  in the data file.

### Typed access layer — `src/lib/projects.ts`

Pure, testable, no `any`:

```ts
type Locale = "en" | "tr";
interface Localized { en: string; tr: string }
interface Project {
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

getAllProjects(): Project[]
getProjectBySlug(slug: string): Project | undefined
getFeaturedProjects(limit?: number): Project[]   // featured === true, capped
getAdjacent(slug: string): { prev: Project | null; next: Project | null }
```

Components import these helpers instead of the JSON directly.

## 2. Pages

- `src/app/projects/page.tsx` → renders `Projects` index. Existing table layout is
  kept; each row becomes a **link** to `/projects/[slug]` and shows the real
  `stack`. The inline accordion expand is removed (detail now lives on its own page).
- `src/app/projects/[slug]/page.tsx` → **server component**:
  - `generateStaticParams()` — pre-renders all 10 detail pages.
  - `generateMetadata({ params })` — per-project `<title>`, description (locale),
    and OpenGraph image = cover screenshot.
  - Unknown slug → `notFound()`.
  - Layout: heading + `ProjectMeta` (year · kind · stack · GitHub/Live) +
    `ProjectGallery` + full localized description + `ProjectNav` (prev/next).

> **Next 16 note:** `params` is a Promise and must be awaited. Read
> `node_modules/next/dist/docs/` for the current App Router APIs
> (`generateStaticParams`, `generateMetadata`, `next/image`) before coding, per
> AGENTS.md.

## 3. Components (small, focused files)

```
src/components/projects/
  ProjectGallery.tsx   "use client" — main image + thumbnail strip, opens Lightbox
  Lightbox.tsx         "use client" — fullscreen overlay; ←/→/Esc, counter, backdrop click
  ProjectMeta.tsx      year · kind · stack chips + GitHub / Live buttons
  ProjectNav.tsx       ← previous / next → (server-safe, uses getAdjacent)
```

Rewired:
- `src/components/sections/Projects.tsx` → reads `getAllProjects()`, rows link out,
  real stack chips, no placeholder media.
- `src/components/sections/FeaturedWork.tsx` → reads `getFeaturedProjects(3)`, each
  card gets a cover thumbnail and links to `/projects/[slug]`.

## 4. Gallery + lightbox — no dependency

Custom, in the terminal aesthetic. No image library added (none exists in deps).

- `next/image` for all screenshots (webp), with an aspect-ratio container.
- Lightbox: keyboard (←/→/Esc) + touch/click, image counter, backdrop dismiss.
- Respects `prefers-reduced-motion`.

> Alternative considered: `yet-another-react-lightbox` — less code but adds a
> dependency and fights the custom theme. **Rejected in favor of custom.**

## 5. i18n, Featured, cleanup

- `messages/en.json` + `messages/tr.json` — add keys:
  `viewSource`, `liveDemo`, `noLive`, `previous`, `next`, `screenshots`,
  `backToProjects`, plus any detail-page headings. Remove the now-unused
  `Projects.media` key.
- `FeaturedWork` shows the first 3 `featured: true` projects with cover images.
- Delete `src/data/ProjectsData.json` and `src/data/FeaturedData.json`.

## 6. Theme constraints (must hold)

- Only existing tokens: `--term-bg{,-elevated,-inset}`, `--term-fg{,-muted,-faint}`,
  `--term-border`, `--term-accent`, `--term-syntax-*`.
- Reuse existing structural patterns: `max-w-[1280px] mx-auto px-8`,
  `border border-term-border rounded-md`, dashed dividers, `font-mono` body /
  `font-display` headings, the `./path` and `$`/`›` motifs.
- Light + dark both correct. New lightbox backdrop uses an existing token (or a
  neutral overlay), not a new palette entry.

## 7. Derived metadata (owner to verify)

`year` / `kind` / `stack` / `featured` are best-guess from descriptions + repos.
Correct directly in `projects.json`.

| n  | slug                  | year | kind (en)             | stack (proposed)                          | featured |
|----|-----------------------|------|-----------------------|-------------------------------------------|----------|
| 01 | fastapi-graphql       | 2024 | Backend · API         | Python, FastAPI, GraphQL, SQLAlchemy, JWT | ✓        |
| 02 | nodejs-backend        | 2023 | Backend · Full-stack  | Node.js, Express, MongoDB, EJS            |          |
| 03 | leave-master-backend  | 2024 | Backend · API         | ASP.NET Core, C#, MongoDB, JWT, Swagger   |          |
| 04 | leave-master-frontend | 2024 | Frontend · Web        | React, React Router                       | ✓        |
| 05 | invoice-payment       | 2023 | Frontend · Fintech    | Next.js, React                            | ✓        |
| 06 | texture-mapping       | 2023 | Graphics · Academic   | C++, SDL, GLM, OpenGL                      |          |
| 07 | socket-programming    | 2023 | Networking · Academic | Python, Sockets (TCP/UDP), HTTP           |          |
| 08 | mssql-database        | 2023 | Database · Academic   | MSSQL, T-SQL                              |          |
| 09 | robotics              | 2022 | Robotics · Academic   | Python, NumPy, 3D sim                     |          |
| 10 | student-registration  | 2022 | OOP · Academic        | Java, Python, JSON                        |          |

(`title`, `description`, `githubUrl`, `images` are taken verbatim from existing
`projects.json`.)

## 8. Out of scope (this branch)

- Test infrastructure (no jest/playwright configured). `lib/projects.ts` is kept
  pure/testable; adding a runner + tests is a separate task.
- Contact form, broader SEO (sitemap/robots), URL-based locale — tracked
  separately from this work.

## Acceptance

- `/projects` lists all 10 with real stack; each row links to its detail page.
- `/projects/[slug]` shows real screenshots in a themed gallery + lightbox, full
  localized description, working GitHub (and Live where set) links, prev/next.
- Home FeaturedWork shows 3 featured projects with covers, linking to detail pages.
- `ProjectsData.json` and `FeaturedData.json` removed; no dead references.
- Light + dark both correct; no new dependencies; existing aesthetic preserved.
- `next build` / lint clean.
