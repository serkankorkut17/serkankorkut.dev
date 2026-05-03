"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Contact() {
  const t = useTranslations('Contact');
  const [openFaq, setOpenFaq] = useState(0);

  const cards = [
    { k: 'email', label: 'email', val: 'serkan@serkankorkut.dev' },
    { k: 'location', label: 'location', val: 'İstanbul, Türkiye' },
    { k: 'github', label: 'github', val: '@serkankorkut' },
    { k: 'linkedin', label: 'linkedin', val: 'in/serkankorkut' },
    { k: 'instagram', label: 'instagram', val: '@serkankorkut' },
    { k: 'facebook', label: 'facebook', val: '/serkankorkut' }
  ];

  const yesItems: any = t.raw('yesItems');
  const noItems: any = t.raw('noItems');
  const faqObj: any = t.raw('faq');
  const faq = Object.values(faqObj);

  return (
    <section className="bg-term-bg-inset text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-14 items-end">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-4 uppercase">{t('tag')}</div>
            <h2 className="font-display text-[40px] md:text-[56px] leading-none font-[800] tracking-[-0.03em] m-0 text-term-fg">{t('title')}</h2>
          </div>
          <p className="text-base text-term-fg-muted m-0 max-w-[480px] md:justify-self-end">{t('sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-term-bg-elevated border border-term-border rounded-md overflow-hidden">
            <div className="h-8 bg-term-bg-inset border-b border-term-border flex items-center px-3 gap-2">
              <div className="flex gap-[6px]">
                <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-auto text-[11px] text-term-fg-faint">{t('message')}</div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-term-fg-faint tracking-[0.1em]"><span className="text-term-accent">$</span> {t('nameLabel')}</span>
                <input className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors" placeholder={t('namePlaceholder')} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-term-fg-faint tracking-[0.1em]"><span className="text-term-accent">$</span> {t('emailLabel')}</span>
                <input className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors" placeholder={t('emailPlaceholder')} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-term-fg-faint tracking-[0.1em]"><span className="text-term-accent">$</span> {t('messageLabel')}</span>
                <textarea rows={5} className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors resize-y min-h-[100px]" placeholder={t('messagePlaceholder')} />
              </label>
              <button className="mt-2 bg-term-accent text-black border-none py-[14px] px-5 font-mono text-[13px] font-[700] cursor-pointer rounded-[3px] flex items-center justify-between hover:opacity-90 transition-opacity">
                <span>{t('sendBtn')}</span><span>↵</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            {cards.map((c) => (
              <div key={c.k} className="bg-term-bg-elevated border border-term-border rounded-md p-6 cursor-pointer flex flex-col gap-2.5 min-h-[140px] hover:border-term-accent transition-colors group">
                <div className="text-[11px] text-term-fg-faint tracking-[0.15em]">./{c.label}</div>
                <div className="text-base text-term-fg font-[600] mt-auto">{c.val}</div>
                <div className="text-xs text-term-accent group-hover:translate-x-1 transition-transform w-fit">{t('openBtn')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3">{t('lookingHead')}</div>
          <h3 className="font-display text-[32px] font-[700] tracking-[-0.02em] m-0 mb-6 text-term-fg">{t('lookingTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-term-bg-elevated border border-term-border rounded-md p-6 border-l-[3px] border-l-term-accent">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-dashed border-term-border">
                <span className="w-[18px] h-[18px] rounded-[3px] bg-term-accent flex items-center justify-center text-xs font-[700] text-black">✓</span>
                <span className="text-term-fg font-[600] text-sm">{t('yes')}</span>
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {yesItems.map((it: any, i: number) => (
                  <li key={i} className="flex gap-2.5 text-[13px] text-term-fg-muted leading-[1.5]">
                    <span className="text-term-accent">›</span><span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-term-bg-elevated border border-term-border rounded-md p-6 border-l-[3px] border-l-term-fg-muted">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-dashed border-term-border">
                <span className="w-[18px] h-[18px] rounded-[3px] bg-term-bg-inset border border-term-border flex items-center justify-center text-xs font-[700] text-term-fg-muted">✗</span>
                <span className="text-term-fg font-[600] text-sm">{t('no')}</span>
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {noItems.map((it: any, i: number) => (
                  <li key={i} className="flex gap-2.5 text-[13px] text-term-fg-faint leading-[1.5] line-through decoration-term-fg-muted">
                    <span className="text-term-fg-faint no-underline">›</span><span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3">{t('faqHead')}</div>
          <h3 className="font-display text-[32px] font-[700] tracking-[-0.02em] m-0 mb-6 text-term-fg">{t('faqTitle')}</h3>
          <div className="bg-term-bg-elevated border border-term-border rounded-md overflow-hidden">
            {faq.map((f: any, i: number) => {
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
