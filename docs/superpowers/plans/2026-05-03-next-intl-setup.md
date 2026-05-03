# Next-Intl Configuration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Configure `next-intl` without i18n routing, use JSON data from `src/data/` to create `messages/en.json` and `messages/tr.json`, and wire up translations in the components.
**Architecture:** Use a `NEXT_LOCALE` cookie in `src/i18n/request.ts` to determine the current locale. `layout.tsx` will wrap the app with `NextIntlClientProvider`. Components will use `useTranslations()`.
**Tech Stack:** Next.js (App Router), next-intl.

---

### Task 1: Setup Next-Intl Plugin and Request Config

**Files:**
- Modify: `next.config.ts`
- Create: `src/i18n/request.ts`

- [ ] **Step 1: Install next-intl**
Run: `npm install next-intl`

- [ ] **Step 2: Update next.config.ts**
Modify `next.config.ts` to use the next-intl plugin.
```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 3: Create src/i18n/request.ts**
```ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

- [ ] **Step 4: Commit**
```bash
git add next.config.ts src/i18n/request.ts package.json package-lock.json
git commit -m "chore: setup next-intl config and plugin"
```

### Task 2: Create Message Files

**Files:**
- Create: `messages/en.json`
- Create: `messages/tr.json`

- [ ] **Step 1: Extract data from src/data/ and create messages/en.json**
Run a Node.js script to dynamically generate this or write it out.
Create `scripts/generate-messages.js`:
```javascript
const fs = require('fs');

const homePage = JSON.parse(fs.readFileSync('src/data/HomePage.json', 'utf8'));
const projects = JSON.parse(fs.readFileSync('src/data/Projects.json', 'utf8'));

const locales = ['en', 'tr'];

if (!fs.existsSync('messages')) {
  fs.mkdirSync('messages');
}

locales.forEach((locale) => {
  const messages = {
    Hero: {
      tag: locale === 'en' ? 'AVAILABLE FOR WORK' : 'İŞ İÇİN MÜSAİT',
      title1: homePage.HeroSection[locale].title.split(', ')[0] + ',',
      title2: homePage.HeroSection[locale].title.split(', ')[1]?.replace('.', '') || 'mühendisi',
      title3: locale === 'en' ? "since '24." : "'24'ten beri.",
      sub: homePage.AboutSection[locale].description,
      cta1: locale === 'en' ? './view_work.sh' : './projeleri_gor.sh',
      cta2: locale === 'en' ? './contact.sh' : './iletisim.sh',
      panel: locale === 'en' ? 'CURRENT FOCUS' : 'ŞU ANDA ODAKTAYIM',
      panelText: locale === 'en' ? 'Backend engineer @ MapaGlobal — maintaining our FAST, BKM, EFT and SWIFT integration services and supporting the banks & e-money / payment institutions that use them.' : 'MapaGlobal\\'da backend engineer — FAST, BKM, EFT ve SWIFT entegrasyon servislerimizin bakımını yapıyor ve hizmet sunduğumuz banka & EPÖ kuruluşlarına teknik destek sağlıyorum.',
    },
    Projects: {
      tag: projects.title[locale] === 'TAKE A LOOK' ? '// projects.list' : '// projects.list',
      title: projects.title[locale] === 'TAKE A LOOK' ? 'Selected work' : 'Seçilmiş işler',
      sub: projects.description[locale],
      items: projects.projects.map(p => ({
        id: p.id.toString(),
        name: p.title[locale],
        desc: p.description[locale]
      }))
    },
    Navigation: {
      home: "home",
      projects: "projects",
      contact: "contact"
    }
  };

  fs.writeFileSync(`messages/${locale}.json`, JSON.stringify(messages, null, 2));
});
```

- [ ] **Step 2: Run script to generate messages**
Run: `node scripts/generate-messages.js`

- [ ] **Step 3: Commit**
```bash
git add messages/ scripts/generate-messages.js
git commit -m "feat: generate messages from data files"
```

### Task 3: Wrap App in NextIntlClientProvider

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add NextIntlClientProvider**
```tsx
import type { Metadata } from "next";
import "./globals.css";

import ScrollToTopButton from "@/components/Mouse/Scroll";
import { Montserrat, Orbitron, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import Navigation from "@/components/layout/Navigation";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const montserrat = Montserrat({ subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-display" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
	title: "Serkan Korkut",
	description: "Welcome to my personal website",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

	return (
		<html lang={locale} className={cn(orbitron.variable, jetbrains.variable)}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body className={`${montserrat.className} bg-term-bg text-term-fg`}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<Navigation />
					<ScrollToTopButton />
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
```

- [ ] **Step 2: Commit**
```bash
git add src/app/layout.tsx
git commit -m "feat: add NextIntlClientProvider to layout"
```

### Task 4: Hook up Navigation Component

**Files:**
- Modify: `src/components/layout/Navigation.tsx`

- [ ] **Step 1: Set cookie and use locale**
In `src/components/layout/Navigation.tsx`:
Import `useLocale` and `useTranslations`.
Change `onToggleLang` to set `document.cookie = "NEXT_LOCALE=...; path=/; max-age=31536000"` and `window.location.reload()`.

- [ ] **Step 2: Commit**
```bash
git add src/components/layout/Navigation.tsx
git commit -m "feat: hook up i18n in Navigation"
```

### Task 5: Hook up Hero Component

**Files:**
- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Use translations in Hero**
Replace hardcoded `content` block with `useTranslations('Hero')` and use it throughout.

- [ ] **Step 2: Commit**
```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: hook up i18n in Hero section"
```

### Task 6: Hook up Projects Component

**Files:**
- Modify: `src/components/sections/Projects.tsx`

- [ ] **Step 1: Use translations in Projects**
Replace hardcoded `content` and `projects` description/title with `useTranslations('Projects')`. Map through `t.raw('items')` if needed or keep structure simple.

- [ ] **Step 2: Commit**
```bash
git add src/components/sections/Projects.tsx
git commit -m "feat: hook up i18n in Projects section"
```
