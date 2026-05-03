# Missing UI Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the missing sections (`About`, `FeaturedWork`, `CurrentlyStrip`, `Contact`, `Footer`) from the UI references into the Next.js project.
**Architecture:** Create individual components for each section using Tailwind CSS `term-*` variables. Assemble them on the appropriate pages (Home and Contact).
**Tech Stack:** Next.js, Tailwind CSS v4.

---

### Task 1: Build About Component

**Files:**
- Create: `src/components/sections/About.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create About component**
```tsx
import React from 'react';
import Link from 'next/link';

export default function About({ lang = 'en' }: { lang?: 'en' | 'tr' }) {
  const content = {
    en: { tag: '// stack.config', title: 'What I work with', sub: 'Java / Spring Boot, MSSQL and Oracle on the day job — maintaining payment-integration services and supporting the institutions that use them. Categorized by where they sit in the stack.',
      cats: [
        { k: 'backend', label: 'Backend & APIs', items: [
            { name: 'Java & Spring Boot', note: 'Enterprise services, REST APIs, JPA' },
            { name: 'C# & .NET Core', note: 'ASP.NET Core, business logic layers' },
            { name: 'Node.js & Express', note: 'RESTful APIs, services, server-side TS' },
            { name: 'Python & FastAPI', note: 'Async APIs, scripting, data tooling' },
          ] },
        { k: 'data', label: 'Databases', items: [
            { name: 'Microsoft SQL Server', note: 'Day-to-day database' },
            { name: 'Oracle Database', note: 'Day-to-day database' },
            { name: 'PostgreSQL & MySQL', note: 'Relational modeling, migrations' },
            { name: 'MongoDB', note: 'Document schemas, aggregation' },
          ] },
        { k: 'frontend', label: 'Frontend & Tooling', items: [
            { name: 'React & Next.js', note: 'Interactive, server-rendered apps' },
            { name: 'TypeScript', note: 'Type-safe interfaces, end to end' },
            { name: 'GraphQL & REST', note: 'API contracts, schema design' },
          ] },
      ] },
    tr: { tag: '// stack.config', title: 'Çalıştığım teknolojiler', sub: 'İş yerinde Java / Spring Boot, MSSQL ve Oracle — ödeme entegrasyonu servislerimizin bakımını yapıp hizmet sunduğumuz kuruluşlara destek veriyoruz. Stack içindeki yerlerine göre kategorize edildi.',
      cats: [
        { k: 'backend', label: 'Backend & API', items: [
            { name: 'Java & Spring Boot', note: 'Kurumsal servisler, REST API, JPA' },
            { name: 'C# & .NET Core', note: 'ASP.NET Core, iş mantığı katmanları' },
            { name: 'Node.js & Express', note: "RESTful API'ler, servisler, sunucu tarafı TS" },
            { name: 'Python & FastAPI', note: "Async API'ler, scripting, veri araçları" },
          ] },
        { k: 'data', label: 'Veritabanları', items: [
            { name: 'Microsoft SQL Server', note: 'Günlük çalıştığım veritabanı' },
            { name: 'Oracle Database', note: 'Günlük çalıştığım veritabanı' },
            { name: 'PostgreSQL & MySQL', note: 'İlişkisel modelleme, migration' },
            { name: 'MongoDB', note: 'Doküman şemaları, aggregation' },
          ] },
        { k: 'frontend', label: 'Frontend & Araçlar', items: [
            { name: 'React & Next.js', note: 'Etkileşimli, sunucu render uygulamalar' },
            { name: 'TypeScript', note: 'Uçtan uca tip güvenli arayüzler' },
            { name: 'GraphQL & REST', note: 'API kontratları, şema tasarımı' },
          ] },
      ] }
  }[lang];

  return (
    <section className="bg-term-bg-inset text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-14 items-end">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-4 uppercase">{content.tag}</div>
            <h2 className="font-display text-[40px] md:text-[56px] leading-none font-[800] tracking-[-0.03em] m-0 text-term-fg">{content.title}</h2>
          </div>
          <p className="text-base leading-[1.6] text-term-fg-muted m-0 max-w-[480px] md:justify-self-end">{content.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.cats.map((cat, ci) => (
            <div key={cat.k} className="bg-term-bg-elevated border border-term-border rounded-md p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dashed border-term-border">
                <span className="text-term-accent text-xs">{String(ci + 1).padStart(2, '0')}</span>
                <span className="text-term-fg-faint text-xs">/</span>
                <span className="text-term-fg text-[13px] font-[600]">{cat.label}</span>
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-[18px]">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2 text-sm">
                      <span className="text-term-accent font-mono">›</span>
                      <span className="text-term-fg font-[600]">{item.name}</span>
                    </div>
                    <div className="text-xs text-term-fg-muted pl-[18px] leading-[1.55]">{item.note}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 md:px-7 md:py-6 bg-term-bg-elevated border border-term-border rounded-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-term-fg-muted">
            <span className="text-term-accent">$</span> {lang === 'en' ? 'interested in collaborating?' : 'birlikte çalışmak ister misin?'}
          </div>
          <Link href="/contact" className="bg-term-fg text-term-bg border-none px-5 py-2.5 font-mono text-[13px] font-[600] rounded-[3px] flex items-center gap-2 hover:opacity-90 transition-opacity no-underline">
            {lang === 'en' ? './contact.sh' : './iletisim.sh'} <span>↵</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to Homepage**
Add `<About />` below `<Hero />` in `src/app/page.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/components/sections/About.tsx src/app/page.tsx
git commit -m "feat: add About section"
```

### Task 2: Build FeaturedWork Component

**Files:**
- Create: `src/components/sections/FeaturedWork.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create FeaturedWork component**
```tsx
import React from 'react';
import Link from 'next/link';

export default function FeaturedWork({ lang = 'en' }: { lang?: 'en' | 'tr' }) {
  const isEn = lang === 'en';
  const items = [
    { n: '01', name: 'Invoice & Payment', kind: 'Fintech', year: '2023', stack: 'Node · MongoDB · Stripe' },
    { n: '02', name: 'Leave Master', kind: 'HR · Full-stack', year: '2024', stack: 'Next.js · .NET · Postgres' },
    { n: '03', name: 'CS2 Nade Library', kind: 'Side project', year: '2024', stack: 'Next.js · MongoDB' },
  ];

  return (
    <section className="bg-term-bg text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-6">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3 uppercase">// featured_work</div>
            <h2 className="font-display text-[40px] md:text-[48px] font-[800] tracking-[-0.03em] m-0 leading-none text-term-fg">
              {isEn ? 'A few things I built' : 'Yaptığım birkaç şey'}
            </h2>
          </div>
          <Link href="/projects" className="bg-transparent border border-term-border text-term-fg px-4 py-2.5 font-mono text-xs rounded flex items-center gap-2 hover:border-term-accent hover:text-term-accent transition-colors w-fit no-underline">
            <span>{isEn ? 'view all' : 'tümünü gör'}</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((p) => (
            <Link key={p.n} href="/projects" className="text-left font-mono bg-term-bg-elevated border border-term-border rounded-md p-6 flex flex-col gap-4 min-h-[200px] text-term-fg hover:border-term-accent transition-colors no-underline group">
              <div className="flex justify-between items-baseline text-[11px] text-term-fg-faint tracking-[0.15em]">
                <span className="text-term-accent font-[700]">{p.n}</span>
                <span>{p.year}</span>
              </div>
              <div className="mt-auto">
                <div className="text-[11px] text-term-fg-faint tracking-[0.1em] mb-1.5">
                  ./{p.kind.toLowerCase().replace(/\s+/g, '_')}
                </div>
                <div className="font-display text-[22px] font-[700] tracking-[-0.01em] text-term-fg leading-[1.15]">
                  {p.name}
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-term-border text-[11px] text-term-fg-muted mt-auto">
                <span>{p.stack}</span>
                <span className="text-term-accent transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to Homepage**
Add `<FeaturedWork />` below `<About />` in `src/app/page.tsx`.
*(Note: Ensure `<Projects />` is removed from `page.tsx` since `Projects` has its own route or is full list. The HTML says: `page === 'home' && (<Hero/><About/><FeaturedWork/><CurrentlyStrip/>)`. Remove `<Projects/>` from `page.tsx`.)*

- [ ] **Step 3: Commit**
```bash
git add src/components/sections/FeaturedWork.tsx src/app/page.tsx
git commit -m "feat: add FeaturedWork section"
```

### Task 3: Build CurrentlyStrip Component

**Files:**
- Create: `src/components/sections/CurrentlyStrip.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create CurrentlyStrip component**
```tsx
import React from 'react';

export default function CurrentlyStrip({ lang = 'en' }: { lang?: 'en' | 'tr' }) {
  const isEn = lang === 'en';
  const items = [
    { label: isEn ? 'working on' : 'üzerinde çalışıyor', val: 'FAST · BKM · EFT · SWIFT', sub: isEn ? 'maintaining + supporting integrations @ MapaGlobal' : 'entegrasyon bakımı + teknik destek @ MapaGlobal' },
    { label: isEn ? 'learning' : 'öğreniyor', val: 'Spring Boot internals', sub: isEn ? 'JPA, transactions, query plans' : 'JPA, transactionlar, query planları' },
    { label: isEn ? 'exploring' : 'keşfediyor', val: isEn ? 'FAST & SWIFT internals' : 'FAST & SWIFT iç yapısı', sub: isEn ? 'message specs, ISO 20022, edge cases' : 'mesaj şartnameleri, ISO 20022, uç durumlar' },
    { label: isEn ? 'side projects' : 'yan projeler', val: 'Next.js · React · React Native', sub: isEn ? 'weekends, just for fun' : 'hafta sonları, eğlence için' },
  ];

  return (
    <section className="bg-term-bg-inset text-term-fg font-mono py-24 px-8 border-b border-term-border w-full overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-6">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3">// now.log</div>
            <h2 className="font-display text-[40px] md:text-[48px] font-[800] tracking-[-0.03em] m-0 leading-none text-term-fg">
              {isEn ? 'Currently' : 'Şu an'}
            </h2>
          </div>
          <div className="text-[11px] text-term-fg-faint font-mono inline-flex items-center gap-2">
            <span className="w-[7px] h-[7px] rounded-full bg-term-accent shadow-[0_0_8px_var(--term-accent)] animate-pulse" />
            <span>{isEn ? 'updated may 2026' : 'mayıs 2026 güncel'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-term-bg-elevated border border-term-border rounded-md">
          {items.map((it, i) => (
            <div key={i} className="p-6 md:p-7 border-b sm:border-b-0 sm:border-r border-term-border last:border-b-0 sm:last:border-r-0 flex flex-col gap-2.5">
              <div className="text-[11px] text-term-fg-faint tracking-[0.1em]">
                ./{it.label.replace(/\s+/g, '_')}
              </div>
              <div className="text-base font-[600] text-term-fg leading-[1.3]">{it.val}</div>
              <div className="text-[11px] text-term-fg-muted mt-auto leading-[1.5]">{it.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to Homepage**
Add `<CurrentlyStrip />` below `<FeaturedWork />` in `src/app/page.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/components/sections/CurrentlyStrip.tsx src/app/page.tsx
git commit -m "feat: add CurrentlyStrip section"
```

### Task 4: Build Footer Component

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Footer Component**
```tsx
import React from 'react';
import Link from 'next/link';

export default function Footer({ lang = 'en' }: { lang?: 'en' | 'tr' }) {
  const isEn = lang === 'en';
  const cols = [
    { head: isEn ? 'navigate' : 'gezin', items: [
        { l: isEn ? 'home' : 'anasayfa', cmd: '~', href: '/' },
        { l: 'projects', cmd: 'projects/', href: '/projects' },
        { l: 'contact', cmd: 'contact.sh', href: '/contact' },
      ] },
    { head: isEn ? 'connect' : 'bağlan', items: [
        { l: 'github', cmd: '@serkankorkut', href: 'https://github.com/serkankorkut17' },
        { l: 'linkedin', cmd: 'in/serkankorkut', href: '#' },
        { l: 'email', cmd: 'serkan@…', href: 'mailto:serkan@serkankorkut.dev' },
      ] },
    { head: isEn ? 'now' : 'şimdi', items: [
        { l: isEn ? 'working' : 'çalışıyor', cmd: '@ MapaGlobal', href: '#' },
        { l: isEn ? 'building' : 'inşa ediyor', cmd: 'FAST · BKM · EFT · SWIFT', href: '#' },
        { l: isEn ? 'location' : 'konum', cmd: 'İstanbul, TR', href: '#' },
      ] },
  ];

  return (
    <footer className="bg-term-bg text-term-fg-muted font-mono border-t border-term-border w-full">
      <div className="max-w-[1280px] mx-auto px-8 pt-16 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 pb-12 border-b border-dashed border-term-border">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 bg-term-accent rounded flex items-center justify-center font-mono font-[700] text-[14px] text-[#0c0d0f]">
                [S]
              </div>
              <span className="text-term-fg font-[600] text-[15px]">serkankorkut</span>
              <span className="text-term-fg-faint text-[15px]">.dev</span>
            </div>
            <p className="m-0 text-[13px] leading-[1.7] text-term-fg-muted max-w-[320px]">
              {isEn ? 'Backend engineer @ MapaGlobal. Maintaining payment-integration services on FAST, BKM, EFT and SWIFT, and supporting the banks and e-money / payment institutions that use them.' : "MapaGlobal'da backend engineer. FAST, BKM, EFT ve SWIFT üzerine kurulu ödeme entegrasyonu servislerimizin bakımını yapıyor, hizmet sunduğumuz banka ve EPÖ kuruluşlarına teknik destek sağlıyor."}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-term-bg-inset border border-term-border text-[11px] text-term-fg-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-term-accent shadow-[0_0_8px_var(--term-accent)]" />
              {isEn ? 'backend engineer @ MapaGlobal' : 'MapaGlobal\'da backend engineer'}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.head}>
              <div className="text-[11px] text-term-accent tracking-[0.18em] mb-[18px] uppercase">// {c.head}</div>
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {c.items.map((it, i) => (
                  <li key={i} className="flex flex-col gap-0.5">
                    <Link href={it.href} className="text-[11px] text-term-fg-faint tracking-[0.05em] hover:text-term-accent transition-colors no-underline">
                      ./{it.l}
                    </Link>
                    <span className="text-[13px] text-term-fg">{it.cmd}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-10 md:pt-10 md:pb-6 relative overflow-hidden text-center">
          <div className="font-display font-[800] text-[clamp(56px,13vw,168px)] leading-[0.85] tracking-[-0.05em] text-transparent select-none break-all" style={{ WebkitTextStroke: '1px var(--term-border-strong, #3a3a40)' }}>
            SERKANKORKUT<span className="text-term-accent" style={{ WebkitTextStroke: '1px var(--term-accent)' }}>.</span>DEV
          </div>
        </div>

        <div className="pt-5 border-t border-term-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-term-fg-faint">
          <div className="flex items-center gap-3">
            <span className="text-term-accent">$</span>
            <span>echo "© 2026 Serkan Korkut · {isEn ? 'all rights reserved' : 'tüm hakları saklıdır'}"</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{isEn ? 'view source: ' : 'kaynak: '}
              <a href="https://github.com/serkankorkut17" target="_blank" rel="noopener noreferrer" className="text-term-fg-muted no-underline border-b border-dashed border-term-fg-faint hover:text-term-accent hover:border-term-accent transition-colors">
                github.com/serkankorkut17
              </a>
            </span>
            <span className="text-term-fg-faint">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-term-accent" />
              v2026.05
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Add to Layout**
Import and add `<Footer />` just before `</body>` in `src/app/layout.tsx`.

- [ ] **Step 3: Commit**
```bash
git add src/components/layout/Footer.tsx src/app/layout.tsx
git commit -m "feat: add Footer component"
```

### Task 5: Build Contact Page and Component

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/projects/page.tsx`

- [ ] **Step 1: Create Contact Component**
*(Code is similar to the `ui/src/contact.jsx` reference. Implement using standard React states for FAQ and standard tailwind classes)*
```tsx
"use client";
import React, { useState } from 'react';

export default function Contact({ lang = 'en' }: { lang?: 'en' | 'tr' }) {
  const t = { accent: 'var(--term-accent)', bgElevated: 'var(--term-bg-elevated)', bgInset: 'var(--term-bg-inset)', border: 'var(--term-border)', fg: 'var(--term-fg)', fgMuted: 'var(--term-fg-muted)', fgFaint: 'var(--term-fg-faint)' };
  const isEn = lang === 'en';
  const [openFaq, setOpenFaq] = useState(0);

  const content = {
    en: { tag: '// contact.sh', title: 'Get in touch', sub: 'Backend engineer @ MapaGlobal. Reach out for partnership questions, integration support, or just to say hi.', fields: { name: 'name', email: 'email', message: 'message' }, send: './send_message.sh', cards: [ { k: 'email', label: 'email', val: 'serkan@serkankorkut.dev' }, { k: 'location', label: 'location', val: 'İstanbul, Türkiye' }, { k: 'github', label: 'github', val: '@serkankorkut' }, { k: 'linkedin', label: 'linkedin', val: 'in/serkankorkut' }, { k: 'instagram', label: 'instagram', val: '@serkankorkut' }, { k: 'facebook', label: 'facebook', val: '/serkankorkut' } ], lookingHead: '// looking_for', lookingTitle: "What I'm up for", yes: 'Yes please', no: 'Not right now', yesItems: [ 'Banks or e-money / payment institutions exploring our services', 'Integration questions on FAST, BKM, EFT or SWIFT', 'Open-source collabs & code reviews', 'Coffee chats with other backend / payments folks' ], noItems: [ 'Crypto / web3 token launches', 'Cold recruiter spam without context', 'Vendor pitches — please go through MapaGlobal' ], faqHead: '// faq.md', faqTitle: 'Often asked', faq: [ { q: 'Where do you work?', a: 'Backend Engineer at MapaGlobal. Our team maintains and evolves the payment-integration services that connect to Turkey\'s rails (FAST, BKM, EFT) and SWIFT, and we provide technical support to the banks and licensed e-money / payment institutions that consume them.' }, { q: 'What does your day look like?', a: 'Mostly extending and patching existing services as new requirements come in, debugging integration issues, and supporting the institutions that use us — message-level investigations, schema tweaks, performance fixes.' }, { q: 'What\'s your stack sweet spot?', a: 'Java / Spring Boot, MSSQL and Oracle on the day job. Node.js, .NET and Python on the side. SQL, integrations and message contracts are where I spend most of my time.' }, { q: 'How fast do you reply?', a: 'Within 24 hours on weekdays, usually faster. If it\'s urgent, mention it in the subject and I\'ll prioritize.' } ] },
    tr: { tag: '// iletisim.sh', title: 'İletişime geç', sub: 'MapaGlobal\'da backend engineer. İşbirliği soruları, entegrasyon desteği veya sadece selam için yaz.', fields: { name: 'isim', email: 'email', message: 'mesaj' }, send: './mesaj_gonder.sh', cards: [ { k: 'email', label: 'email', val: 'serkan@serkankorkut.dev' }, { k: 'location', label: 'konum', val: 'İstanbul, Türkiye' }, { k: 'github', label: 'github', val: '@serkankorkut' }, { k: 'linkedin', label: 'linkedin', val: 'in/serkankorkut' }, { k: 'instagram', label: 'instagram', val: '@serkankorkut' }, { k: 'facebook', label: 'facebook', val: '/serkankorkut' } ], lookingHead: '// aradığım', lookingTitle: 'Ne arıyorum', yes: 'Evet, lütfen', no: 'Şu an değil', yesItems: [ 'Servislerimizi değerlendiren banka / EPÖ kuruluşları', 'FAST, BKM, EFT veya SWIFT entegrasyon soruları', 'Açık kaynak işbirlikleri & code review', 'Backend / ödeme sistemleri üzerine sohbet' ], noItems: [ 'Crypto / web3 token launchleri', 'Bağlamsız soğuk recruiter mesajları', 'Satıcı teklifleri — lütfen MapaGlobal\'dan geçirin' ], faqHead: '// sss.md', faqTitle: 'Sıkça sorulanlar', faq: [ { q: 'Nerede çalışıyorsun?', a: 'MapaGlobal\'da Backend Engineer. Ekibimiz Turkiye\'nin ödeme altyapılarına (FAST, BKM, EFT) ve sınır ötesi için SWIFT\'e bağlanan ödeme entegrasyonu servislerinin bakımını yapıyor; hizmet sunduğumuz banka ve lisanslı elektronik para / ödeme kuruluşlarına teknik destek sağlıyoruz.' }, { q: 'Günün nasıl geçiyor?', a: 'Genelde yeni gereksinimler geldiğinde mevcut servisleri geliştirmek/yamamak, entegrasyon sorunlarını debug etmek ve hizmet sunduğumuz kuruluşlara destek vermek — mesaj seviyesinde incelemeler, şema düzenlemeleri, performans çözümleri.' }, { q: 'Hangi stack\'te en iyisin?', a: 'İş yerinde Java / Spring Boot, MSSQL ve Oracle. Yan tarafta Node.js, .NET ve Python. SQL, entegrasyonlar ve mesaj kontratları en çok vakit geçirdiğim alanlar.' }, { q: 'Ne kadar hızlı dönüyorsun?', a: 'Hafta içi 24 saat içinde, genelde daha hızlı. Aciliyet varsa konuda belirt, öne alırım.' } ] }
  }[lang];

  return (
    <section className="bg-term-bg-inset text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-14 items-end">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-4 uppercase">{content.tag}</div>
            <h2 className="font-display text-[40px] md:text-[56px] leading-none font-[800] tracking-[-0.03em] m-0 text-term-fg">{content.title}</h2>
          </div>
          <p className="text-base text-term-fg-muted m-0 max-w-[480px] md:justify-self-end">{content.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-term-bg-elevated border border-term-border rounded-md overflow-hidden">
            <div className="h-8 bg-term-bg-inset border-b border-term-border flex items-center px-3 gap-2">
              <div className="flex gap-[6px]">
                <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-auto text-[11px] text-term-fg-faint">~/message.txt</div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-term-fg-faint tracking-[0.1em]"><span className="text-term-accent">$</span> {content.fields.name}</span>
                <input className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors" placeholder="Ada Lovelace" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-term-fg-faint tracking-[0.1em]"><span className="text-term-accent">$</span> {content.fields.email}</span>
                <input className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors" placeholder="ada@example.com" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-term-fg-faint tracking-[0.1em]"><span className="text-term-accent">$</span> {content.fields.message}</span>
                <textarea rows={5} className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors resize-y min-h-[100px]" placeholder={isEn ? 'Tell me about your project…' : 'Projenden bahset…'} />
              </label>
              <button className="mt-2 bg-term-accent text-black border-none py-[14px] px-5 font-mono text-[13px] font-[700] cursor-pointer rounded-[3px] flex items-center justify-between hover:opacity-90 transition-opacity">
                <span>{content.send}</span><span>↵</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            {content.cards.map((c) => (
              <div key={c.k} className="bg-term-bg-elevated border border-term-border rounded-md p-6 cursor-pointer flex flex-col gap-2.5 min-h-[140px] hover:border-term-accent transition-colors group">
                <div className="text-[11px] text-term-fg-faint tracking-[0.15em]">./{c.label}</div>
                <div className="text-base text-term-fg font-[600] mt-auto">{c.val}</div>
                <div className="text-xs text-term-accent group-hover:translate-x-1 transition-transform w-fit">open →</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3">{content.lookingHead}</div>
          <h3 className="font-display text-[32px] font-[700] tracking-[-0.02em] m-0 mb-6 text-term-fg">{content.lookingTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-term-bg-elevated border border-term-border rounded-md p-6 border-l-[3px] border-l-term-accent">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-dashed border-term-border">
                <span className="w-[18px] h-[18px] rounded-[3px] bg-term-accent flex items-center justify-center text-xs font-[700] text-black">✓</span>
                <span className="text-term-fg font-[600] text-sm">{content.yes}</span>
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {content.yesItems.map((it, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] text-term-fg-muted leading-[1.5]">
                    <span className="text-term-accent">›</span><span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-term-bg-elevated border border-term-border rounded-md p-6 border-l-[3px] border-l-term-fg-muted">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-dashed border-term-border">
                <span className="w-[18px] h-[18px] rounded-[3px] bg-term-bg-inset border border-term-border flex items-center justify-center text-xs font-[700] text-term-fg-muted">✗</span>
                <span className="text-term-fg font-[600] text-sm">{content.no}</span>
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {content.noItems.map((it, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] text-term-fg-faint leading-[1.5] line-through decoration-term-fg-muted">
                    <span className="text-term-fg-faint no-underline">›</span><span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3">{content.faqHead}</div>
          <h3 className="font-display text-[32px] font-[700] tracking-[-0.02em] m-0 mb-6 text-term-fg">{content.faqTitle}</h3>
          <div className="bg-term-bg-elevated border border-term-border rounded-md overflow-hidden">
            {content.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className={`border-b border-term-border last:border-b-0`}>
                  <button onClick={() => setOpenFaq(open ? -1 : i)} className="w-full flex items-center gap-4 p-5 md:px-6 bg-transparent data-[state=open]:bg-term-bg-inset border-none cursor-pointer text-left font-mono text-term-fg transition-colors hover:bg-term-bg-inset" data-state={open ? 'open' : 'closed'}>
                    <span className="text-term-accent text-[13px] font-[700] min-w-[28px]">Q{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 text-sm font-[500]">{f.q}</span>
                    <span className="text-term-fg-muted text-base">{open ? '–' : '+'}</span>
                  </button>
                  {open && (
                    <div className="px-6 pb-6 pt-0 md:pl-[68px] text-[13px] leading-[1.7] text-term-fg-muted bg-term-bg-inset">
                      <span className="text-term-accent">›</span> {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create routes**
Create `src/app/projects/page.tsx`:
```tsx
import Projects from "@/components/sections/Projects";
export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Projects />
    </main>
  );
}
```

Create `src/app/contact/page.tsx`:
```tsx
import Contact from "@/components/sections/Contact";
export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Contact />
    </main>
  );
}
```

- [ ] **Step 3: Commit**
```bash
git add src/components/sections/Contact.tsx src/app/projects/page.tsx src/app/contact/page.tsx
git commit -m "feat: add Contact component and routes"
```
