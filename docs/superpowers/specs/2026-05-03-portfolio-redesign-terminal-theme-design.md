# Portfolio Redesign: Terminal/IDE Theme

## Overview
This document specifies the design and architecture for redesigning the portfolio website (serkankorkut.dev) to feature a "Terminal/IDE" aesthetic. The redesign utilizes Next.js (App Router), Tailwind CSS v4, and Shadcn UI.

## Context
The project currently uses Next.js 16 and Tailwind CSS v4. The goal is to implement a specific visual design defined in the `ui/src/` reference files while maintaining component modularity and utilizing modern Shadcn UI primitives.

## Architecture

### 1. Theme and Styling
- **Tokens:** The light and dark mode color palettes from `ui/src/tokens.jsx` will be mapped to CSS variables in `src/app/globals.css`.
- **Primary Color:** The accent color `#ff6600` (Orange) will serve as the primary brand color.
- **Typography:**
  - Display Font: `Orbitron` (or a similar futuristic/display font) via `next/font/google`.
  - Mono Font: `JetBrains Mono` (or similar monospace font) via `next/font/google`.
  - These will be integrated into the Tailwind v4 configuration via CSS variables.

### 2. UI Components (Shadcn UI)
To ensure accessibility, consistency, and ease of maintenance, standard Shadcn UI components will be adapted to fit the terminal aesthetic:
- **Button:** Used for call-to-action actions (e.g., `./view_work.sh`, `./contact.sh`).
- **Sheet (or Drawer):** Used for the mobile slide-in navigation sidebar.
- **Accordion:** Used for the `Projects` section to implement the expandable index list.

### 3. Component Structure
The UI will be broken down into modular components located in `src/components/`:
- `components/layout/Navigation.tsx`: The sticky top bar and mobile menu integration.
- `components/sections/Hero.tsx`: The hero section featuring the code editor window mock.
- `components/sections/Projects.tsx`: The interactive project list using Shadcn Accordion.

### 4. Data Integration
Content will be dynamically driven from existing JSON files in `src/data/`:
- `src/data/HomePage.json`: Drives the Hero section content (titles, subtitles, stats).
- `src/data/Projects.json`: Drives the Projects section (list of selected works, tech stack, descriptions).
- The existing internationalization setup (`next-intl`) will be preserved to support both English (en) and Turkish (tr) content.

## Design Details (By Section)

### Hero Section
- **Visuals:** Grid layout (desktop) with a left column for typography/CTAs and a right column representing an IDE window (`~/about.ts`).
- **Features:** Code syntax highlighting mock, interactive buttons styled as terminal commands.

### Navigation
- **Visuals:** Minimalist top bar with a brand logo (`[S] serkankorkut.dev`).
- **Features:** Links styled as paths (`./home`, `projects/`), status pill (`@ MapaGlobal`), and language/theme toggles. Mobile view collapses links into a hamburger menu that opens a Shadcn Sheet.

### Projects Section
- **Visuals:** Data-table like header row with expandable accordion items.
- **Features:** Clicking a project row expands it to reveal a description and a placeholder for project media. Monospace typography throughout to mimic terminal logs.

## Success Criteria
- The visual aesthetic matches the `ui/src/` reference exactly (colors, fonts, borders, layout).
- Components are modular, typed (TypeScript), and reusable.
- Shadcn UI components are successfully customized to fit the theme without losing their accessibility features.
- Dark and Light modes toggle seamlessly.
- Internationalization (EN/TR) works correctly with the new UI.
