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
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3">{"//"} now.log</div>
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
