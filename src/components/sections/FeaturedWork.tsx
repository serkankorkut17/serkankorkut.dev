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
