// HomeExtras — Featured Work (mini list) + Currently strip
function FeaturedWork({ theme, lang, onSeeAll }) {
  const t = TOKENS[theme];
  const isEn = lang === 'en';

  // Curated 3 — pulled from projects.jsx, kept short
  const items = [
    { n: '01', name: 'Invoice & Payment', kind: 'Fintech', year: '2023', stack: 'Node · MongoDB · Stripe' },
    { n: '02', name: 'Leave Master', kind: 'HR · Full-stack', year: '2024', stack: 'Next.js · .NET · Postgres' },
    { n: '03', name: 'CS2 Nade Library', kind: 'Side project', year: '2024', stack: 'Next.js · MongoDB' },
  ];

  return (
    <section data-sk="section" style={{
      background: t.bg, color: t.fg, fontFamily: MONO,
      padding: '96px 32px', borderBottom: `1px solid ${t.border}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Heading */}
        <div data-sk="featured-head" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'end',
          marginBottom: 32, gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 11, color: t.accent, letterSpacing: '0.18em', marginBottom: 12 }}>
              // featured_work
            </div>
            <h2 data-sk="section-title" style={{
              fontFamily: DISPLAY, fontSize: 48, fontWeight: 800,
              letterSpacing: '-0.03em', margin: 0, lineHeight: 1,
            }}>
              {isEn ? 'A few things I built' : 'Yaptığım birkaç şey'}
            </h2>
          </div>
          <button
            onClick={onSeeAll}
            style={{
              background: 'transparent', border: `1px solid ${t.border}`, color: t.fg,
              padding: '10px 16px', fontFamily: MONO, fontSize: 12, cursor: 'pointer',
              borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'border-color .15s, color .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.fg; }}
          >
            <span>{isEn ? 'view all' : 'tümünü gör'}</span>
            <span>→</span>
          </button>
        </div>

        {/* Grid of 3 cards */}
        <div data-sk="featured-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
        }}>
          {items.map((p) => (
            <button
              key={p.n}
              onClick={onSeeAll}
              style={{
                textAlign: 'left', cursor: 'pointer', fontFamily: MONO,
                background: t.bgElevated, border: `1px solid ${t.border}`,
                borderRadius: 6, padding: '24px',
                display: 'flex', flexDirection: 'column', gap: 16, minHeight: 200,
                color: t.fg, transition: 'border-color .15s, transform .15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; }}
            >
              {/* index + year */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                fontSize: 11, color: t.fgFaint, letterSpacing: '0.15em',
              }}>
                <span style={{ color: t.accent, fontWeight: 700 }}>{p.n}</span>
                <span>{p.year}</span>
              </div>

              {/* name */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: 11, color: t.fgFaint, letterSpacing: '0.1em', marginBottom: 6 }}>
                  ./{p.kind.toLowerCase().replace(/\s+/g, '_')}
                </div>
                <div style={{
                  fontFamily: DISPLAY, fontSize: 22, fontWeight: 700,
                  letterSpacing: '-0.01em', color: t.fg, lineHeight: 1.15,
                }}>{p.name}</div>
              </div>

              {/* stack + arrow */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 12, borderTop: `1px dashed ${t.border}`,
                fontSize: 11, color: t.fgMuted,
              }}>
                <span>{p.stack}</span>
                <span style={{ color: t.accent }}>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
window.FeaturedWork = FeaturedWork;

// Scroll-to-top button — fixed bottom-right
function ScrollTopButton({ theme }) {
  const t = TOKENS[theme];
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={goTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      style={{
        position: 'fixed', right: 20, bottom: 20, zIndex: 90,
        width: 44, height: 44, borderRadius: 8,
        background: t.bgInset,
        border: `1px solid ${t.border}`,
        color: t.fgMuted,
        cursor: 'pointer', fontFamily: MONO,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity .25s ease, transform .25s ease, color .15s, border-color .15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = t.accent;
        e.currentTarget.style.borderColor = t.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = t.fgMuted;
        e.currentTarget.style.borderColor = t.border;
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 13 V3" />
        <path d="M3.5 7.5 L8 3 L12.5 7.5" />
      </svg>
    </button>
  );
}
window.ScrollTopButton = ScrollTopButton;

function CurrentlyStrip({ theme, lang }) {
  const t = TOKENS[theme];
  const isEn = lang === 'en';

  const items = [
    {
      label: isEn ? 'working on' : 'üzerinde çalışıyor',
      val: 'FAST · BKM · EFT · SWIFT',
      sub: isEn ? 'maintaining + supporting integrations @ MapaGlobal' : 'entegrasyon bakımı + teknik destek @ MapaGlobal',
    },
    {
      label: isEn ? 'learning' : 'öğreniyor',
      val: 'Spring Boot internals',
      sub: isEn ? 'JPA, transactions, query plans' : 'JPA, transactionlar, query planları',
    },
    {
      label: isEn ? 'exploring' : 'keşfediyor',
      val: isEn ? 'FAST & SWIFT internals' : 'FAST & SWIFT iç yapısı',
      sub: isEn ? 'message specs, ISO 20022, edge cases' : 'mesaj şartnameleri, ISO 20022, uç durumlar',
    },
    {
      label: isEn ? 'side projects' : 'yan projeler',
      val: 'Next.js · React · React Native',
      sub: isEn ? 'weekends, just for fun' : 'hafta sonları, eğlence için',
    },
  ];

  return (
    <section data-sk="section" style={{
      background: t.bgInset, color: t.fg, fontFamily: MONO,
      padding: '96px 32px', borderBottom: `1px solid ${t.border}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div data-sk="now-head" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'end',
          marginBottom: 32, gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 11, color: t.accent, letterSpacing: '0.18em', marginBottom: 12 }}>
              // now.log
            </div>
            <h2 data-sk="section-title" style={{
              fontFamily: DISPLAY, fontSize: 48, fontWeight: 800,
              letterSpacing: '-0.03em', margin: 0, lineHeight: 1,
            }}>
              {isEn ? 'Currently' : 'Şu an'}
            </h2>
          </div>
          <div style={{
            fontSize: 11, color: t.fgFaint, fontFamily: MONO,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: t.accent,
              boxShadow: `0 0 8px ${t.accent}`,
              animation: 'sk-pulse 2s ease-in-out infinite',
            }} />
            <span>{isEn ? 'updated may 2026' : 'mayıs 2026 güncel'}</span>
          </div>
        </div>

        {/* 4-col strip */}
        <div data-sk="now-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 6,
          overflow: 'hidden',
        }}>
          {items.map((it, i) => (
            <div key={i} style={{
              padding: '28px 24px', borderRight: i < items.length - 1 ? `1px solid ${t.border}` : 'none',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ fontSize: 11, color: t.fgFaint, letterSpacing: '0.1em' }}>
                ./{it.label.replace(/\s+/g, '_')}
              </div>
              <div style={{
                fontSize: 16, fontWeight: 600, color: t.fg, lineHeight: 1.3,
              }}>{it.val}</div>
              <div style={{ fontSize: 11, color: t.fgMuted, marginTop: 'auto', lineHeight: 1.5 }}>
                {it.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </section>
  );
}
window.CurrentlyStrip = CurrentlyStrip;
