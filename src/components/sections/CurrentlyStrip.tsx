"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import currentlyData from '@/data/CurrentlyData.json';

export default function CurrentlyStrip() {
  const t = useTranslations('CurrentlyStrip');
  const locale = useLocale() as 'en' | 'tr';

  return (
    <section className="bg-term-bg-inset text-term-fg font-mono py-24 px-8 border-b border-term-border w-full overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-6">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3">{t('tag')}</div>
            <h2 className="font-display text-[40px] md:text-[48px] font-[800] tracking-[-0.03em] m-0 leading-none text-term-fg">
              {t('title')}
            </h2>
          </div>
          <div className="text-[11px] text-term-fg-faint font-mono inline-flex items-center gap-2">
            <span className="w-[7px] h-[7px] rounded-full bg-term-accent shadow-[0_0_8px_var(--term-accent)] animate-pulse" />
            <span>{t('updated')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-term-bg-elevated border border-term-border rounded-md">
          {currentlyData.map((it: any, i: number) => (
            <div key={i} className="p-6 md:p-7 border-b sm:border-b-0 sm:border-r border-term-border last:border-b-0 sm:last:border-r-0 flex flex-col gap-2.5">
              <div className="text-[11px] text-term-fg-faint tracking-[0.1em]">
                ./{it.label[locale].replace(/\s+/g, '_')}
              </div>
              <div className="text-base font-[600] text-term-fg leading-[1.3]">{typeof it.val === 'string' ? it.val : it.val[locale]}</div>
              <div className="text-[11px] text-term-fg-muted mt-auto leading-[1.5]">{it.sub[locale]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
