# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio website using a Terminal/IDE aesthetic with Tailwind CSS v4 and Shadcn UI.
**Architecture:** Add design tokens to `globals.css` as CSS variables. Create modular components (`Navigation`, `Hero`, `Projects`) using Shadcn primitives. Hook them up with the Next.js setup.
**Tech Stack:** Next.js (App Router), Tailwind CSS v4, Shadcn UI.

---

### Task 1: Initialize Shadcn UI and Add Fonts

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Initialize shadcn/ui**
Run: `npx shadcn@latest init -d`
*(Note: If prompted, accept defaults. Components should go to `src/components/ui`)*

- [ ] **Step 2: Install required shadcn components**
Run: `npx shadcn@latest add button sheet accordion`

- [ ] **Step 3: Setup Terminal Fonts in Layout**
Modify `src/app/layout.tsx` to include `Orbitron` and `JetBrains_Mono`.
```tsx
import { Montserrat, Orbitron, JetBrains_Mono } from "next/font/google";

const montserrat = Montserrat({
	weight: ["400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});

const orbitron = Orbitron({
    subsets: ["latin"],
    variable: "--font-display",
});

const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

// Update the body className to include the variables:
// className={`${montserrat.className} ${orbitron.variable} ${jetbrains.variable} ...`}
```

- [ ] **Step 4: Commit**
```bash
git add src/app/layout.tsx components.json components/
git commit -m "chore: setup shadcn and fonts"
```

### Task 2: Configure Theme Tokens

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add Terminal Tokens to globals.css**
Append the terminal tokens as CSS variables in `src/app/globals.css`.
```css
@layer base {
  :root {
    --term-bg: #f6f5f1;
    --term-bg-elevated: #ffffff;
    --term-bg-inset: #eeece6;
    --term-fg: #0a0a0a;
    --term-fg-muted: #5a5a55;
    --term-fg-faint: #9a9a93;
    --term-border: #d8d6cf;
    --term-accent: #ff6600;
  }

  .dark {
    --term-bg: #0c0d0f;
    --term-bg-elevated: #15171a;
    --term-bg-inset: #08090b;
    --term-fg: #f0eee9;
    --term-fg-muted: #9a9a93;
    --term-fg-faint: #5a5a55;
    --term-border: #27272a;
    --term-accent: #ff6600;
  }
}
```

- [ ] **Step 2: Commit**
```bash
git add src/app/globals.css
git commit -m "style: add terminal theme tokens"
```

### Task 3: Build Navigation Component

**Files:**
- Create: `src/components/layout/Navigation.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Navigation Component**
Create `src/components/layout/Navigation.tsx`. Use the `Sheet` component from Shadcn for the mobile menu. Build the desktop top bar layout using the `--term-*` CSS variables and font variables (`var(--font-mono)`).

- [ ] **Step 2: Add Navigation to Layout**
Import and render `<Navigation />` in `src/app/layout.tsx` inside the `<body/>` tag, just above `{children}`.

- [ ] **Step 3: Commit**
```bash
git add src/components/layout/Navigation.tsx src/app/layout.tsx
git commit -m "feat: add terminal navigation component"
```

### Task 4: Build Hero Component

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Hero Component**
Create `src/components/sections/Hero.tsx`. Implement the two-column grid layout. The left column contains typography and CTAs (using Shadcn `Button`). The right column mocks an IDE window with syntax highlighting colors from `ui/src/tokens.jsx`.

- [ ] **Step 2: Integrate into Homepage**
Update `src/app/page.tsx` to render `<Hero />` instead of the Next.js boilerplate. Ensure the page container has the terminal background applied.

- [ ] **Step 3: Commit**
```bash
git add src/components/sections/Hero.tsx src/app/page.tsx
git commit -m "feat: add hero section"
```

### Task 5: Build Projects Component

**Files:**
- Create: `src/components/sections/Projects.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Projects Component**
Create `src/components/sections/Projects.tsx`. Use Shadcn `Accordion` to render the list of projects (from `src/data/Projects.json`). Style the accordion items as data table rows as specified in the design.

- [ ] **Step 2: Integrate into Homepage**
Render `<Projects />` below `<Hero />` in `src/app/page.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/components/sections/Projects.tsx src/app/page.tsx
git commit -m "feat: add projects section"
```
