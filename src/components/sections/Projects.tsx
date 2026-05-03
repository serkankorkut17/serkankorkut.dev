"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from 'next-intl';
import projectsData from '@/data/ProjectsData.json';

export default function Projects() {
  const t = useTranslations('Projects');
  const locale = useLocale() as 'en' | 'tr';

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [openId, setOpenId] = useState<string | null>('leave-master');

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
              {t('tag')}
            </div>
            <h2 className="font-display text-[40px] md:text-[56px] leading-none font-[800] tracking-[-0.03em] m-0 text-term-fg">
              {t('title')}
            </h2>
          </div>
          <p className="text-base text-term-fg-muted m-0 max-w-[480px] md:justify-self-end">
            {t('sub')}
          </p>
        </div>

        {/* Index list */}
        <div className="border border-term-border rounded-md overflow-hidden bg-term-bg-elevated">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[60px_1fr_1.4fr_1.6fr_80px] px-6 py-3 border-b border-term-border bg-term-bg-inset text-[11px] text-term-fg-faint tracking-[0.1em]">
            <div>{t('col1')}</div>
            <div>{t('col2')}</div>
            <div>{t('col3')}</div>
            <div>{t('col4')}</div>
            <div className="text-right">{t('col5')}</div>
          </div>

          <div className="w-full">
            {projectsData.items.map((p, i) => {
              const open = openId === p.id;
              return (
                <div key={p.id} className={cn(i < projectsData.items.length - 1 ? "border-b border-term-border" : "")}>
                  <button
                    onClick={() => setOpenId(open ? null : p.id)}
                    className={cn(
                      "w-full flex flex-col md:grid md:grid-cols-[60px_1fr_1.4fr_1.6fr_80px] px-6 py-5 items-start md:items-center gap-4 bg-transparent border-none cursor-pointer text-left font-mono text-term-fg transition-colors",
                      open ? "bg-term-bg-inset" : "hover:bg-term-bg-inset"
                    )}
                  >
                    <div className="flex w-full md:contents">
                      <div className="text-term-accent text-[13px] font-[700] w-16 md:w-auto">{p.n}</div>
                      <div className="text-term-fg-muted text-[13px] w-20 md:w-auto">{p.year}</div>
                      <div className="flex-1 md:contents">
                        <div className="md:w-full">
                          <div className="text-[16px] font-[600] text-term-fg">{p.name}</div>
                          <div className="text-[12px] text-term-fg-faint mt-0.5">{p.kind}</div>
                        </div>
                      </div>
                      <div className="text-right text-term-fg-muted text-[16px] ml-auto md:hidden">
                        {open ? '–' : '+'}
                      </div>
                    </div>
                    
                    {/* Desktop columns continued */}
                    <div className="hidden md:flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span key={s} className="text-[11px] px-2 py-0.5 border border-term-border rounded-[3px] text-term-fg-muted">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="hidden md:block text-right text-term-fg-muted text-[16px]">
                      {open ? '–' : '+'}
                    </div>
                  </button>

                  {open && (
                    <div className="px-6 pb-7 md:pl-[84px] grid grid-cols-1 md:grid-cols-2 gap-6 items-start bg-term-bg-inset">
                      <p className="m-0 text-[14px] leading-[1.65] text-term-fg-muted max-w-[540px]">
                        {p.desc[locale]}
                      </p>
                      <div
                        className="w-full aspect-video rounded flex items-center justify-center text-term-fg-faint text-[11px] tracking-[0.1em] border border-term-border"
                        style={{
                          background: theme === 'dark'
                            ? 'repeating-linear-gradient(45deg, #15171a, #15171a 8px, #1a1c20 8px, #1a1c20 16px)'
                            : 'repeating-linear-gradient(45deg, #eeece6, #eeece6 8px, #f6f5f1 8px, #f6f5f1 16px)'
                        }}
                      >
                        {t('media')}
                      </div>
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
