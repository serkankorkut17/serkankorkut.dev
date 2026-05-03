// About / Skills — categorized, monochrome, terminal-flavored
function About({ theme, lang }) {
  const t = TOKENS[theme];

  const content = {
      en: { tag: '// stack.config', title: 'What I work with', sub: 'Java / Spring Boot, MSSQL and Oracle on the day job — maintaining payment-integration services and supporting the institutions that use them. Categorized by where they sit in the stack.',
      cats: [
        {
          k: 'backend',
          label: 'Backend & APIs',
          items: [
            { name: 'Java & Spring Boot', note: 'Enterprise services, REST APIs, JPA' },
            { name: 'C# & .NET Core', note: 'ASP.NET Core, business logic layers' },
            { name: 'Node.js & Express', note: 'RESTful APIs, services, server-side TS' },
            { name: 'Python & FastAPI', note: 'Async APIs, scripting, data tooling' },
          ],
        },
        {
          k: 'data',
          label: 'Databases',
          items: [
            { name: 'Microsoft SQL Server', note: 'Day-to-day database' },
            { name: 'Oracle Database', note: 'Day-to-day database' },
            { name: 'PostgreSQL & MySQL', note: 'Relational modeling, migrations' },
            { name: 'MongoDB', note: 'Document schemas, aggregation' },
          ],
        },
        {
          k: 'frontend',
          label: 'Frontend & Tooling',
          items: [
            { name: 'React & Next.js', note: 'Interactive, server-rendered apps' },
            { name: 'TypeScript', note: 'Type-safe interfaces, end to end' },
            { name: 'GraphQL & REST', note: 'API contracts, schema design' },
          ],
        },
      ],
    },
    tr: {
      tag: '// stack.config',
      title: 'Çalıştığım teknolojiler',
      sub: 'İş yerinde Java / Spring Boot, MSSQL ve Oracle — ödeme entegrasyonu servislerimizin bakımını yapıp hizmet sunduğumuz kuruluşlara destek veriyoruz. Stack içindeki yerlerine göre kategorize edildi.',
      cats: [
        {
          k: 'backend',
          label: 'Backend & API',
          items: [
            { name: 'Java & Spring Boot', note: 'Kurumsal servisler, REST API, JPA' },
            { name: 'C# & .NET Core', note: 'ASP.NET Core, iş mantığı katmanları' },
            { name: 'Node.js & Express', note: "RESTful API'ler, servisler, sunucu tarafı TS" },
            { name: 'Python & FastAPI', note: "Async API'ler, scripting, veri araçları" },
          ],
        },
        {
          k: 'data',
          label: 'Veritabanları',
          items: [
            { name: 'Microsoft SQL Server', note: 'Günlük çalıştığım veritabanı' },
            { name: 'Oracle Database', note: 'Günlük çalıştığım veritabanı' },
            { name: 'PostgreSQL & MySQL', note: 'İlişkisel modelleme, migration' },
            { name: 'MongoDB', note: 'Doküman şemaları, aggregation' },
          ],
        },
        {
          k: 'frontend',
          label: 'Frontend & Araçlar',
          items: [
            { name: 'React & Next.js', note: 'Etkileşimli, sunucu render uygulamalar' },
            { name: 'TypeScript', note: 'Uçtan uca tip güvenli arayüzler' },
            { name: 'GraphQL & REST', note: 'API kontratları, şema tasarımı' },
          ],
        },
      ],
    },
  }[lang];

  return (
    <section data-sk="section" style={{
      background: t.bgInset, color: t.fg, fontFamily: MONO,
      padding: '96px 32px', borderBottom: `1px solid ${t.border}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Heading */}
        <div data-sk="about-head" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, marginBottom: 56, alignItems: 'end' }}>
          <div>
            <div data-sk="section-tag" style={{ fontSize: 11, color: t.accent, letterSpacing: '0.18em', marginBottom: 16 }}>
              {content.tag}
            </div>
            <h2 data-sk="section-title" style={{
              fontFamily: DISPLAY, fontSize: 56, lineHeight: 1, fontWeight: 800,
              letterSpacing: '-0.03em', margin: 0, color: t.fg,
            }}>
              {content.title}
            </h2>
          </div>
          <p style={{
            fontSize: 16, lineHeight: 1.6, color: t.fgMuted, margin: 0,
            maxWidth: 480, justifySelf: 'end',
          }}>{content.sub}</p>
        </div>

        {/* Categories */}
        <div data-sk="about-cats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {content.cats.map((cat, ci) => (
            <div key={cat.k} style={{
              background: t.bgElevated, border: `1px solid ${t.border}`,
              borderRadius: 6, padding: '24px',
            }}>
              {/* Category header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24,
                paddingBottom: 16, borderBottom: `1px dashed ${t.border}`,
              }}>
                <span style={{ color: t.accent, fontSize: 12 }}>{String(ci + 1).padStart(2, '0')}</span>
                <span style={{ color: t.fgFaint, fontSize: 12 }}>/</span>
                <span style={{ color: t.fg, fontSize: 13, fontWeight: 600 }}>{cat.label}</span>
              </div>

              {/* Items */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {cat.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{
                      display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 14,
                    }}>
                      <span style={{ color: t.accent, fontFamily: MONO }}>›</span>
                      <span style={{ color: t.fg, fontWeight: 600 }}>{item.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: t.fgMuted, paddingLeft: 18, lineHeight: 1.55 }}>
                      {item.note}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div style={{
          marginTop: 48, padding: '24px 28px', background: t.bgElevated,
          border: `1px solid ${t.border}`, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 14, color: t.fgMuted }}>
            <span style={{ color: t.accent }}>$</span>{' '}
            {lang === 'en'
              ? 'interested in collaborating?'
              : 'birlikte çalışmak ister misin?'}
          </div>
          <button style={{
            background: t.fg, color: t.bg, border: 'none', padding: '10px 20px',
            fontFamily: MONO, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, borderRadius: 3,
          }}>
            {lang === 'en' ? './contact.sh' : './iletisim.sh'} <span>↵</span>
          </button>
        </div>
      </div>
    </section>
  );
}
window.About = About;
