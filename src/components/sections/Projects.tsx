"use client";

import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default function Projects({ lang = 'en' }: { lang?: 'en' | 'tr' }) {
  const content = {
    en: { tag: '// projects.list', title: 'Selected work', sub: 'A focused index. Click any row to expand.' },
    tr: { tag: '// projects.list', title: 'Seçilmiş işler', sub: 'Odaklı bir index. Detay için bir satıra tıklayın.' },
  }[lang];

  const projects = [
    {
      id: 'leave-master', n: '01', year: '2024',
      name: 'Leave Master',
      kind: 'Full-stack · HR',
      stack: ['Next.js', 'TypeScript', '.NET Core', 'PostgreSQL'],
      desc: lang === 'en'
        ? 'Employee leave-management system with role-based dashboards, approvals, and audit trails. Designed the API contract and the frontend together for type-safe ergonomics.'
        : 'Rol tabanlı paneller, onay akışı ve denetim kaydı içeren çalışan izin yönetim sistemi. API kontratını ve frontend\'i birlikte tasarladım, tip güvenli ergonomi için.',
    },
    {
      id: 'fastapi-graphql', n: '02', year: '2024',
      name: 'FastAPI + GraphQL Service',
      kind: 'Backend · API',
      stack: ['Python', 'FastAPI', 'GraphQL', 'PostgreSQL'],
      desc: lang === 'en'
        ? 'A schema-first GraphQL service over FastAPI with cursor pagination, dataloaders, and JWT auth. Built as a reusable starter for future async Python projects.'
        : "FastAPI üzerinde schema-first GraphQL servisi: cursor pagination, dataloader ve JWT auth. Gelecekteki async Python projeleri için yeniden kullanılabilir bir başlangıç.",
    },
    {
      id: 'invoice', n: '03', year: '2023',
      name: 'Invoice & Payment',
      kind: 'Full-stack · Fintech',
      stack: ['Node.js', 'Express', 'MongoDB', 'Stripe'],
      desc: lang === 'en'
        ? 'Recurring billing with Stripe, PDF invoice generation, and a customer-facing portal. Idempotent webhooks and retry logic kept payment state consistent.'
        : 'Stripe ile recurring billing, PDF fatura ve müşteri portalı. Idempotent webhook ve retry mantığıyla ödeme durumu tutarlı tutuluyor.',
    },
    {
      id: 'cs2', n: '04', year: '2024',
      name: 'CS2 Nade Library',
      kind: 'Web app · Gaming',
      stack: ['Next.js', 'MongoDB', 'Cloudinary'],
      desc: lang === 'en'
        ? 'A community library of CS2 grenade lineups with map filters, video previews, and admin moderation. Cloudinary handles the media pipeline.'
        : 'CS2 nade lineup\'ları için topluluk kütüphanesi: harita filtreleri, video önizleme ve admin moderasyonu. Medya pipeline\'ı Cloudinary üzerinde.',
    },
    {
      id: 'texture', n: '05', year: '2023',
      name: 'Texture Mapping',
      kind: 'Graphics · Academic',
      stack: ['C++', 'OpenGL', 'GLSL'],
      desc: lang === 'en'
        ? 'A from-scratch texture mapping pipeline for an undergrad graphics course. UV unwrapping, mipmaps, anisotropic filtering — implemented to actually understand them.'
        : 'Lisans grafik dersi için sıfırdan texture mapping pipeline. UV unwrapping, mipmap, anisotropic filtering — gerçekten anlamak için implemente edildi.',
    },
    {
      id: 'robotics', n: '06', year: '2022',
      name: 'Autonomous Robotics',
      kind: 'Embedded · Academic',
      stack: ['C++', 'ROS', 'Arduino'],
      desc: lang === 'en'
        ? 'Line-following and obstacle-avoidance robot built for a competition. PID tuning, sensor fusion, and a lot of late nights.'
        : 'Yarışma için yapılmış çizgi takip ve engel kaçınma robotu. PID ayarı, sensör füzyonu ve çok sayıda geç gece.',
    },
  ];

  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    }
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-term-bg text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-12 items-end">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-4">
              {content.tag}
            </div>
            <h2 className="font-display text-[40px] md:text-[56px] leading-none font-[800] tracking-[-0.03em] m-0 text-term-fg">
              {content.title}
            </h2>
          </div>
          <p className="text-base text-term-fg-muted m-0 max-w-[480px] md:justify-self-end">
            {content.sub}
          </p>
        </div>

        {/* Index list */}
        <div className="border border-term-border rounded-md overflow-hidden bg-term-bg-elevated">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[60px_1fr_1.4fr_1.6fr_80px] px-6 py-3 border-b border-term-border bg-term-bg-inset text-[11px] text-term-fg-faint tracking-[0.1em]">
            <div>NO.</div>
            <div>YEAR</div>
            <div>PROJECT</div>
            <div>STACK</div>
            <div className="text-right">VIEW</div>
          </div>

          <Accordion type="single" collapsible className="w-full" defaultValue="leave-master">
            {projects.map((p, i) => (
              <AccordionItem
                key={p.id}
                value={p.id}
                className={cn(
                  "border-none",
                  i < projects.length - 1 ? "border-b border-term-border" : ""
                )}
              >
                <AccordionTrigger
                  className="group flex w-full flex-col md:grid md:grid-cols-[60px_1fr_1.4fr_1.6fr_80px] px-6 py-5 items-start md:items-center gap-4 bg-transparent border-none cursor-pointer text-left font-mono text-term-fg transition-colors hover:no-underline hover:bg-term-bg-inset data-[state=open]:bg-term-bg-inset [&>svg]:hidden"
                >
                  <div className="flex w-full md:contents">
                    <div className="text-term-accent text-[13px] font-[700] w-16 md:w-auto">{p.n}</div>
                    <div className="text-term-fg-muted text-[13px] w-20 md:w-auto">{p.year}</div>
                    <div className="flex-1 md:contents">
                      <div className="text-base font-[600] text-term-fg">{p.name}</div>
                      <div className="text-xs text-term-fg-faint mt-0.5 md:hidden">{p.kind}</div>
                    </div>
                    {/* Hide the trailing indicator on mobile header */}
                    <div className="text-term-fg-muted text-base ml-auto md:hidden group-data-[state=open]:hidden">+</div>
                    <div className="text-term-fg-muted text-base ml-auto md:hidden hidden group-data-[state=open]:block">–</div>
                  </div>
                  
                  {/* Desktop columns continued */}
                  <div className="hidden md:block">
                    <div className="text-xs text-term-fg-faint mt-0.5">{p.kind}</div>
                  </div>
                  <div className="hidden md:flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span key={s} className="text-[11px] px-2 py-0.5 border border-term-border rounded-[3px] text-term-fg-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="hidden md:block text-right text-term-fg-muted text-base group-data-[state=open]:hidden">+</div>
                  <div className="hidden md:block text-right text-term-fg-muted text-base hidden group-data-[state=open]:block">–</div>
                </AccordionTrigger>

                <AccordionContent className="p-0">
                  {/* Content grid */}
                  <div className="px-6 pb-7 pt-2 md:pl-[84px] grid grid-cols-1 md:grid-cols-2 gap-6 items-start bg-term-bg-inset">
                    <p className="m-0 text-sm leading-[1.65] text-term-fg-muted max-w-[540px]">
                      {p.desc}
                    </p>
                    <div
                      className="w-full aspect-video rounded flex items-center justify-center text-term-fg-faint text-[11px] tracking-[0.1em] border border-term-border"
                      style={{
                        background: theme === 'dark'
                          ? 'repeating-linear-gradient(45deg, #15171a, #15171a 8px, #1a1c20 8px, #1a1c20 16px)'
                          : 'repeating-linear-gradient(45deg, #eeece6, #eeece6 8px, #f6f5f1 8px, #f6f5f1 16px)'
                      }}
                    >
                      [ PROJECT MEDIA ]
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
