"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import aboutData from '@/data/AboutData.json';

export default function About() {
  const t = useTranslations('About');
  const locale = useLocale() as 'en' | 'tr';

  return (
    <section className="bg-term-bg-inset text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-14 items-end">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-4 uppercase">{t('tag')}</div>
            <h2 className="font-display text-[40px] md:text-[56px] leading-none font-[800] tracking-[-0.03em] m-0 text-term-fg">{t('title')}</h2>
          </div>
          <p className="text-base leading-[1.6] text-term-fg-muted m-0 max-w-[480px] md:justify-self-end">{t('sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aboutData.cats.map((cat: any, ci: number) => {
            return (
              <div key={cat.id} className="bg-term-bg-elevated border border-term-border rounded-md p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dashed border-term-border">
                  <span className="text-term-accent text-xs">{String(ci + 1).padStart(2, '0')}</span>
                  <span className="text-term-fg-faint text-xs">/</span>
                  <span className="text-term-fg text-[13px] font-[600]">{cat.label[locale]}</span>
                </div>
                <ul className="list-none p-0 m-0 flex flex-col gap-[18px]">
                  {cat.items.map((item: any, i: number) => (
                    <li key={i} className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2 text-sm">
                        <span className="text-term-accent font-mono">›</span>
                        <span className="text-term-fg font-[600]">{item.name}</span>
                      </div>
                      <div className="text-xs text-term-fg-muted pl-[18px] leading-[1.55]">{item.note[locale]}</div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 md:px-7 md:py-6 bg-term-bg-elevated border border-term-border rounded-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-term-fg-muted">
            <span className="text-term-accent">$</span> {t('collab')}
          </div>
          <Link href="/contact" className="bg-term-fg text-term-bg border-none px-5 py-2.5 font-mono text-[13px] font-[600] rounded-[3px] flex items-center gap-2 hover:opacity-90 transition-opacity no-underline">
            {t('contact')} <span>↵</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
