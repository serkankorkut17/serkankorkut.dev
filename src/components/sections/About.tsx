import React from 'react';
import Link from 'next/link';

export default function About({ lang = 'en' }: { lang?: 'en' | 'tr' }) {
  const content = {
    en: { tag: '// stack.config', title: 'What I work with', sub: 'Java / Spring Boot, MSSQL and Oracle on the day job — maintaining payment-integration services and supporting the institutions that use them. Categorized by where they sit in the stack.',
      cats: [
        { k: 'backend', label: 'Backend & APIs', items: [
            { name: 'Java & Spring Boot', note: 'Enterprise services, REST APIs, JPA' },
            { name: 'C# & .NET Core', note: 'ASP.NET Core, business logic layers' },
            { name: 'Node.js & Express', note: 'RESTful APIs, services, server-side TS' },
            { name: 'Python & FastAPI', note: 'Async APIs, scripting, data tooling' },
          ] },
        { k: 'data', label: 'Databases', items: [
            { name: 'Microsoft SQL Server', note: 'Day-to-day database' },
            { name: 'Oracle Database', note: 'Day-to-day database' },
            { name: 'PostgreSQL & MySQL', note: 'Relational modeling, migrations' },
            { name: 'MongoDB', note: 'Document schemas, aggregation' },
          ] },
        { k: 'frontend', label: 'Frontend & Tooling', items: [
            { name: 'React & Next.js', note: 'Interactive, server-rendered apps' },
            { name: 'TypeScript', note: 'Type-safe interfaces, end to end' },
            { name: 'GraphQL & REST', note: 'API contracts, schema design' },
          ] },
      ] },
    tr: { tag: '// stack.config', title: 'Çalıştığım teknolojiler', sub: 'İş yerinde Java / Spring Boot, MSSQL ve Oracle — ödeme entegrasyonu servislerimizin bakımını yapıp hizmet sunduğumuz kuruluşlara destek veriyoruz. Stack içindeki yerlerine göre kategorize edildi.',
      cats: [
        { k: 'backend', label: 'Backend & API', items: [
            { name: 'Java & Spring Boot', note: 'Kurumsal servisler, REST API, JPA' },
            { name: 'C# & .NET Core', note: 'ASP.NET Core, iş mantığı katmanları' },
            { name: 'Node.js & Express', note: "RESTful API'ler, servisler, sunucu tarafı TS" },
            { name: 'Python & FastAPI', note: "Async API'ler, scripting, veri araçları" },
          ] },
        { k: 'data', label: 'Veritabanları', items: [
            { name: 'Microsoft SQL Server', note: 'Günlük çalıştığım veritabanı' },
            { name: 'Oracle Database', note: 'Günlük çalıştığım veritabanı' },
            { name: 'PostgreSQL & MySQL', note: 'İlişkisel modelleme, migration' },
            { name: 'MongoDB', note: 'Doküman şemaları, aggregation' },
          ] },
        { k: 'frontend', label: 'Frontend & Araçlar', items: [
            { name: 'React & Next.js', note: 'Etkileşimli, sunucu render uygulamalar' },
            { name: 'TypeScript', note: 'Uçtan uca tip güvenli arayüzler' },
            { name: 'GraphQL & REST', note: 'API kontratları, şema tasarımı' },
          ] },
      ] }
  }[lang];

  return (
    <section className="bg-term-bg-inset text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-14 items-end">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-4 uppercase">{content.tag}</div>
            <h2 className="font-display text-[40px] md:text-[56px] leading-none font-[800] tracking-[-0.03em] m-0 text-term-fg">{content.title}</h2>
          </div>
          <p className="text-base leading-[1.6] text-term-fg-muted m-0 max-w-[480px] md:justify-self-end">{content.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.cats.map((cat, ci) => (
            <div key={cat.k} className="bg-term-bg-elevated border border-term-border rounded-md p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-dashed border-term-border">
                <span className="text-term-accent text-xs">{String(ci + 1).padStart(2, '0')}</span>
                <span className="text-term-fg-faint text-xs">/</span>
                <span className="text-term-fg text-[13px] font-[600]">{cat.label}</span>
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-[18px]">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2 text-sm">
                      <span className="text-term-accent font-mono">›</span>
                      <span className="text-term-fg font-[600]">{item.name}</span>
                    </div>
                    <div className="text-xs text-term-fg-muted pl-[18px] leading-[1.55]">{item.note}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 md:px-7 md:py-6 bg-term-bg-elevated border border-term-border rounded-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-term-fg-muted">
            <span className="text-term-accent">$</span> {lang === 'en' ? 'interested in collaborating?' : 'birlikte çalışmak ister misin?'}
          </div>
          <Link href="/contact" className="bg-term-fg text-term-bg border-none px-5 py-2.5 font-mono text-[13px] font-[600] rounded-[3px] flex items-center gap-2 hover:opacity-90 transition-opacity no-underline">
            {lang === 'en' ? './contact.sh' : './iletisim.sh'} <span>↵</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
