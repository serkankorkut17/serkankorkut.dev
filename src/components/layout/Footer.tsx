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
