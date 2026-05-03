import React from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import ppImage from '@/images/pp.jpeg';

export default function Hero({ lang = 'en' }: { lang?: 'en' | 'tr' }) {
  const content = {
    en: {
      tag: 'AVAILABLE FOR WORK',
      title1: 'Backend',
      title2: 'engineer',
      title3: "since '24.",
      sub: 'Backend Engineer at MapaGlobal. We maintain and evolve our payment-integration services on FAST, BKM, EFT and SWIFT — and provide technical support to the banks and e-money / payment institutions that use them.',
      cta1: './view_work.sh',
      cta2: './contact.sh',
      panel: 'CURRENT FOCUS',
      panelText: 'Backend engineer @ MapaGlobal — maintaining our FAST, BKM, EFT and SWIFT integration services and supporting the banks & e-money / payment institutions that use them.',
    },
    tr: {
      tag: 'İŞ İÇİN MÜSAİT',
      title1: 'Backend',
      title2: 'mühendisi',
      title3: "'24'ten beri.",
      sub: 'MapaGlobal\'da Backend Engineer. FAST, BKM, EFT ve SWIFT üzerine kurulu ödeme entegrasyonu servislerimizi geliştirip bakımını yapıyor, hizmet sunduğumuz banka ve elektronik para / ödeme kuruluşlarına teknik destek sağlıyoruz.',
      cta1: './projeleri_gor.sh',
      cta2: './iletisim.sh',
      panel: 'ŞU ANDA ODAKTAYIM',
      panelText: 'MapaGlobal\'da backend engineer — FAST, BKM, EFT ve SWIFT entegrasyon servislerimizin bakımını yapıyor ve hizmet sunduğumuz banka & EPÖ kuruluşlarına teknik destek sağlıyorum.',
    },
  }[lang];

  const codeSnippet = [
    ['c', '// snippet from about.ts'],
    ['blank'],
    ['line', [['kw', 'export const '], ['prop', 'serkan'], ['p', ' = {']]],
    ['line', [['p', '  '], ['prop', 'name'], ['p', ': '], ['s', '"Serkan Korkut"'], ['p', ',']]],
    ['line', [['p', '  '], ['prop', 'role'], ['p', ': '], ['s', '"Backend Engineer"'], ['p', ',']]],
    ['line', [['p', '  '], ['prop', 'edu'], ['p', ': '], ['s', '"Marmara · CE · Class of \\\'25"'], ['p', ',']]],
    ['line', [['p', '  '], ['prop', 'stack'], ['p', ': ['], ['s', '"Spring Boot"'], ['p', ', '], ['s', '"MSSQL"'], ['p', ', '], ['s', '"Oracle"'], ['p', '],']]],
    ['line', [['p', '  '], ['prop', 'status'], ['p', ': '], ['s', '"employed"'], ['p', ',']]],
    ['line', [['p', '  '], ['prop', 'workingAt'], ['p', ': '], ['s', '"MapaGlobal"'], ['p', ',']]],
    ['line', [['p', '  '], ['prop', 'domain'], ['p', ': ['], ['s', '"FAST"'], ['p', ', '], ['s', '"BKM"'], ['p', ', '], ['s', '"EFT"'], ['p', ', '], ['s', '"SWIFT"'], ['p', '],']]],
    ['line', [['p', '  '], ['prop', 'serves'], ['p', ': '], ['s', '"banks + e-money/PSP"'], ['p', ',']]],
    ['line', [['p', '  '], ['prop', 'role'], ['p', ': '], ['s', '"Backend Engineer"'], ['p', ',']]],
    ['line', [['p', '};']]],
  ];

  return (
    <section className="bg-term-bg text-term-fg font-mono border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] min-h-[calc(100vh-56px)]">
        {/* Left — code-like content */}
        <div className="py-20 lg:pr-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-term-border">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 text-[11px] text-term-accent tracking-[0.18em] mb-8 uppercase">
            <span className="w-[7px] h-[7px] rounded-full bg-term-accent shadow-[0_0_12px_var(--term-accent)]" />
            {lang === 'en' ? 'BACKEND ENGINEER @ MAPAGLOBAL' : 'BACKEND ENGINEER @ MAPAGLOBAL'} · 2026
          </div>

          {/* Big title */}
          <h1 className="font-display text-[64px] sm:text-[80px] lg:text-[96px] leading-[0.95] font-[800] tracking-[-0.04em] m-0 text-term-fg">
            {content.title1}<br />
            {content.title2}<br />
            <span className="text-transparent italic" style={{ WebkitTextStroke: '2px var(--term-accent)' }}>
              {content.title3}
            </span>
          </h1>

          {/* Sub */}
          <p className="mt-8 text-base leading-[1.65] text-term-fg-muted max-w-[520px] font-mono">
            {content.sub}
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap gap-3">
            <button className="bg-term-accent text-black border-none px-[22px] py-[14px] font-mono text-[13px] font-[700] cursor-pointer flex items-center gap-2.5 rounded-[3px] hover:opacity-90 transition-opacity">
              {content.cta1}
              <span className="opacity-70">↵</span>
            </button>
            <button className="bg-transparent text-term-fg border border-term-border px-[22px] py-[14px] font-mono text-[13px] cursor-pointer flex items-center gap-2.5 rounded-[3px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              {content.cta2}
              <span className="text-term-fg-faint">↵</span>
            </button>
          </div>

          {/* Bottom strip */}
          <div className="mt-16 pt-6 border-t border-dashed border-term-border flex gap-8 text-[11px] text-term-fg-faint">
            <div>
              <span className="text-term-fg-muted">spring boot</span> ·{' '}
              <span className="text-term-fg-muted">mssql</span> ·{' '}
              <span className="text-term-fg-muted">oracle</span> ·{' '}
              <span className="text-term-fg-muted">node</span> ·{' '}
              <span className="text-term-fg-muted">.net</span>
            </div>
          </div>
        </div>

        {/* Right — IDE panel */}
        <div className="py-20 lg:pl-14 flex flex-col justify-center overflow-hidden">
          <div className="bg-term-bg-elevated border border-term-border rounded-md overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
            {/* Window header */}
            <div className="h-8 bg-term-bg-inset border-b border-term-border flex items-center px-3 gap-2">
              <div className="flex gap-[6px]">
                <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-auto text-[11px] text-term-fg-faint">~/about.ts</div>
            </div>

            {/* Profile + code */}
            <div className="p-6 pb-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full shrink-0 border-2 border-term-accent overflow-hidden">
                  <Image src={ppImage} alt="Serkan Korkut" fill className="object-cover" />
                </div>
                <div>
                  <div className="font-display text-base font-[700] tracking-[0.03em] text-term-fg">
                    SERKAN KORKUT
                  </div>
                  <div className="text-xs text-term-fg-muted mt-1">
                    @serkankorkut · İstanbul, TR
                  </div>
                </div>
              </div>
            </div>

            <pre className="m-0 p-6 pt-0 text-[13px] leading-[1.75] font-mono text-term-fg overflow-x-auto">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {codeSnippet.map((row: any, i) => {
                if (row[0] === 'c') return <div key={i} className="text-term-syntax-comment italic">{row[1]}</div>;
                if (row[0] === 'blank') return <div key={i}>&nbsp;</div>;
                return (
                  <div key={i}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {row[1].map((seg: any, j: number) => {
                      let colorClass = "";
                      if (seg[0] === 'kw') colorClass = "text-term-syntax-kw";
                      else if (seg[0] === 'prop') colorClass = "text-term-syntax-prop";
                      else if (seg[0] === 's') colorClass = "text-term-syntax-str";
                      
                      return (
                        <span key={j} className={colorClass}>{seg[1]}</span>
                      );
                    })}
                  </div>
                );
              })}
            </pre>

            {/* Status footer */}
            <div className="border-t border-term-border px-4 py-3 bg-term-bg-inset flex items-center gap-2 text-[11px] text-term-fg-muted">
              <span className="text-term-accent">●</span>
              <span>main</span>
              <span className="ml-auto truncate max-w-[200px] sm:max-w-full" title={content.panel}>{content.panel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
