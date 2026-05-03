// Hero — terminal/IDE aesthetic
function Hero({ theme, lang }) {
  const t = TOKENS[theme];

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
      title3: "'24\u2019ten beri.",
      sub: 'MapaGlobal\'da Backend Engineer. FAST, BKM, EFT ve SWIFT üzerine kurulu ödeme entegrasyonu servislerimizi geliştirip bakımını yapıyor, hizmet sunduğumuz banka ve elektronik para / ödeme kuruluşlarına teknik destek sağlıyoruz.',
      cta1: './projeleri_gor.sh',
      cta2: './iletisim.sh',
      panel: 'ŞU ANDA ODAKTAYIM',
      panelText: 'MapaGlobal\'da backend engineer — FAST, BKM, EFT ve SWIFT entegrasyon servislerimizin bakım ını yapıyor ve hizmet sunduğumuz banka & EPÖ kuruluşlarına teknik destek sağlıyorum.',
    },
  }[lang];

  return (
    <section data-sk="hero-section" style={{
      background: t.bg, color: t.fg, fontFamily: MONO,
      borderBottom: `1px solid ${t.border}`,
    }}>
      <div data-sk="hero-grid" style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 32px',
        display: 'grid', gridTemplateColumns: '1.35fr 1fr', minHeight: 'calc(100vh - 56px)',
      }}>
        {/* Left — code-like content */}
        <div data-sk="hero-left" style={{
          padding: '80px 56px 80px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderRight: `1px solid ${t.border}`,
        }}>
          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11,
            color: t.accent, letterSpacing: '0.18em', marginBottom: 32,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: t.accent,
              boxShadow: `0 0 12px ${t.accent}`,
            }} />
            {lang === 'en' ? 'BACKEND ENGINEER @ MAPAGLOBAL' : 'BACKEND ENGINEER @ MAPAGLOBAL'} · 2026
          </div>

          {/* Big title */}
          <h1 data-sk="hero-title" style={{
            fontFamily: DISPLAY, fontSize: 96, lineHeight: 0.95, fontWeight: 800,
            letterSpacing: '-0.04em', margin: 0, color: t.fg,
          }}>
            {content.title1}<br />
            {content.title2}<br />
            <span style={{
              color: 'transparent', WebkitTextStroke: `2px ${t.accent}`,
              fontStyle: 'italic',
            }}>{content.title3}</span>
          </h1>

          {/* Sub */}
          <p data-sk="hero-sub" style={{
            marginTop: 32, fontSize: 16, lineHeight: 1.65, color: t.fgMuted,
            maxWidth: 520, fontFamily: MONO,
          }}>{content.sub}</p>

          {/* Actions */}
          <div data-sk="hero-actions" style={{ marginTop: 40, display: 'flex', gap: 12 }}>
            <button style={{
              background: t.accent, color: '#000', border: 'none', padding: '14px 22px',
              fontFamily: MONO, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, borderRadius: 3,
            }}>
              {content.cta1}
              <span style={{ opacity: 0.7 }}>↵</span>
            </button>
            <button style={{
              background: 'transparent', color: t.fg, border: `1px solid ${t.border}`,
              padding: '14px 22px', fontFamily: MONO, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, borderRadius: 3,
            }}>
              {content.cta2}
              <span style={{ color: t.fgFaint }}>↵</span>
            </button>
          </div>

          {/* Bottom strip */}
          <div style={{
            marginTop: 64, paddingTop: 24, borderTop: `1px dashed ${t.border}`,
            display: 'flex', gap: 32, fontSize: 11, color: t.fgFaint,
          }}>
            <div><span style={{ color: t.fgMuted }}>spring boot</span> · <span style={{ color: t.fgMuted }}>mssql</span> · <span style={{ color: t.fgMuted }}>oracle</span> · <span style={{ color: t.fgMuted }}>node</span> · <span style={{ color: t.fgMuted }}>.net</span></div>
          </div>
        </div>

        {/* Right — IDE panel */}
        <div data-sk="hero-right" style={{
          padding: '80px 0 80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 6,
            overflow: 'hidden', boxShadow: theme === 'dark' ? '0 24px 48px rgba(0,0,0,0.4)' : '0 16px 40px rgba(0,0,0,0.06)',
          }}>
            {/* Window header */}
            <div style={{
              height: 32, background: t.bgInset, borderBottom: `1px solid ${t.border}`,
              display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 11, color: t.fgFaint }}>~/about.ts</div>
            </div>

            {/* Profile + code */}
            <div style={{ padding: '24px 24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                  backgroundImage: 'url(assets/pp.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center',
                  border: `2px solid ${t.accent}`,
                }} />
                <div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, letterSpacing: '0.03em', color: t.fg }}>
                    SERKAN KORKUT
                  </div>
                  <div style={{ fontSize: 12, color: t.fgMuted, marginTop: 4 }}>
                    @serkankorkut · İstanbul, TR
                  </div>
                </div>
              </div>
            </div>

            <pre data-sk="hero-codeblock" style={{
              margin: 0, padding: '0 24px 24px', fontSize: 13, lineHeight: 1.75,
              fontFamily: MONO, color: t.fg,
            }}>
{[
  ['c', '// snippet from about.ts'],
  ['blank'],
  ['line', [['kw', 'export const '], ['prop', 'serkan'], ['p', ' = {']]],
  ['line', [['p', '  '], ['prop', 'name'], ['p', ': '], ['s', '"Serkan Korkut"'], ['p', ',']]],
  ['line', [['p', '  '], ['prop', 'role'], ['p', ': '], ['s', '"Backend Engineer"'], ['p', ',']]],
  ['line', [['p', '  '], ['prop', 'edu'], ['p', ': '], ['s', '"Marmara · CE · Class of \'25"'], ['p', ',']]],
  ['line', [['p', '  '], ['prop', 'stack'], ['p', ': ['], ['s', '"Spring Boot"'], ['p', ', '], ['s', '"MSSQL"'], ['p', ', '], ['s', '"Oracle"'], ['p', '],']]],
  ['line', [['p', '  '], ['prop', 'status'], ['p', ': '], ['s', '"employed"'], ['p', ',']]],
  ['line', [['p', '  '], ['prop', 'workingAt'], ['p', ': '], ['s', '"MapaGlobal"'], ['p', ',']]],
  ['line', [['p', '  '], ['prop', 'domain'], ['p', ': ['], ['s', '"FAST"'], ['p', ', '], ['s', '"BKM"'], ['p', ', '], ['s', '"EFT"'], ['p', ', '], ['s', '"SWIFT"'], ['p', '],']]],
  ['line', [['p', '  '], ['prop', 'serves'], ['p', ': '], ['s', '"banks + e-money/PSP"'], ['p', ',']]],
  ['line', [['p', '  '], ['prop', 'role'], ['p', ': '], ['s', '"Backend Engineer"'], ['p', ',']]],
  ['line', [['p', '};']]],
].map((row, i) => {
  if (row[0] === 'c') return <div key={i} style={{ color: t.syntaxComment, fontStyle: 'italic' }}>{row[1]}</div>;
  if (row[0] === 'blank') return <div key={i}>&nbsp;</div>;
  return (
    <div key={i}>
      {row[1].map((seg, j) => (
        <span key={j} style={{
          color: seg[0] === 'kw' ? t.syntaxKw : seg[0] === 'prop' ? t.syntaxProp : seg[0] === 's' ? t.syntaxStr : t.fg,
        }}>{seg[1]}</span>
      ))}
    </div>
  );
})}
            </pre>

            {/* Status footer */}
            <div style={{
              borderTop: `1px solid ${t.border}`, padding: '12px 16px',
              background: t.bgInset, display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 11, color: t.fgMuted,
            }}>
              <span style={{ color: t.accent }}>●</span>
              <span>main</span>
              <span style={{ marginLeft: 'auto' }}>{content.panel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
