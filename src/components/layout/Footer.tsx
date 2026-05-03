import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const cols = [
    {
      head: t('navigate'), items: [
        { l: t('home'), cmd: t('homeCmd'), href: '/' },
        { l: t('projects'), cmd: t('projectsCmd'), href: '/projects' },
        { l: t('contact'), cmd: t('contactCmd'), href: '/contact' },
      ]
    },
    {
      head: t('connect'), items: [
        { l: t('github'), cmd: process.env.NEXT_PUBLIC_GITHUB_HANDLE || '@serkankorkut', href: process.env.NEXT_PUBLIC_GITHUB_URL || '#' },
        { l: t('linkedin'), cmd: process.env.NEXT_PUBLIC_LINKEDIN_HANDLE || 'in/serkankorkut', href: process.env.NEXT_PUBLIC_LINKEDIN_URL || '#' },
        { l: t('email'), cmd: process.env.NEXT_PUBLIC_EMAIL_HANDLE || 'serkan@…', href: process.env.NEXT_PUBLIC_EMAIL_URL || '#' },
      ]
    },
    {
      head: t('now'), items: [
        { l: t('working'), cmd: '@ MapaGlobal', href: process.env.NEXT_PUBLIC_NOW_WORKING || '#' },
        { l: t('building'), cmd: 'FAST · BKM · EFT · SWIFT', href: process.env.NEXT_PUBLIC_NOW_BUILDING || '#' },
        { l: t('location'), cmd: 'İstanbul, TR', href: process.env.NEXT_PUBLIC_NOW_LOCATION || '#' },
      ]
    },
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
              {t('desc')}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-term-bg-inset border border-term-border text-[11px] text-term-fg-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-term-accent shadow-[0_0_8px_var(--term-accent)]" />
              {t('pill')}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.head}>
              <div className="text-[11px] text-term-accent tracking-[0.18em] mb-[18px] uppercase">{"//"} {c.head}</div>
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {c.items.map((it, i) => (
                  <li key={i} className="flex flex-col gap-0.5">
                    <Link href={it.href} className="text-[11px] text-term-fg-faint tracking-[0.05em] hover:text-term-accent transition-colors no-underline">
                      ./{it.l}
                    </Link>
                    <Link href={it.href} className="text-[13px] text-term-fg hover:text-term-accent transition-colors no-underline">
                      {it.cmd}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="py-10 md:pt-10 md:pb-6 relative overflow-hidden flex w-full group">
        <div className="flex animate-footer-marquee font-display font-[800] text-[clamp(56px,13vw,168px)] leading-[0.85] tracking-[-0.05em] text-transparent select-none whitespace-nowrap" style={{ WebkitTextStroke: '1px var(--term-border-strong, #3a3a40)' }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} className="px-4 md:px-8">
              SERKANKORKUT<span className="text-term-accent" style={{ WebkitTextStroke: '1px var(--term-accent)' }}>.</span>DEV
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 pb-6">
        <div className="pt-5 border-t border-term-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-term-fg-faint">
          <div className="flex items-center gap-3">
            <span className="text-term-accent">$</span>
            <span>echo &quot;© {new Date().getFullYear()} Serkan Korkut · {t('copy')}&quot;</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{t('source')}
              <a href={process.env.NEXT_PUBLIC_GITHUB_URL || "#"} target="_blank" rel="noopener noreferrer" className="text-term-fg-muted no-underline border-b border-dashed border-term-fg-faint hover:text-term-accent hover:border-term-accent transition-colors">
                github.com/serkankorkut17
              </a>
            </span>
            <span className="text-term-fg-faint">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-term-accent" />
              v{new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
