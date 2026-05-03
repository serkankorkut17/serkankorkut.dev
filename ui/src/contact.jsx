// Contact + Footer
function Contact({ theme, lang }) {
  const t = TOKENS[theme];
  const isEn = lang === 'en';
  const [openFaq, setOpenFaq] = React.useState(0);

  const content = {
    en: {
      tag: '// contact.sh',
      title: 'Get in touch',
      sub: 'Backend engineer @ MapaGlobal. Reach out for partnership questions, integration support, or just to say hi.',
      fields: { name: 'name', email: 'email', message: 'message' },
      send: './send_message.sh',
      cards: [
        { k: 'email', label: 'email', val: 'serkan@serkankorkut.dev' },
        { k: 'location', label: 'location', val: 'İstanbul, Türkiye' },
        { k: 'github', label: 'github', val: '@serkankorkut' },
        { k: 'linkedin', label: 'linkedin', val: 'in/serkankorkut' },
        { k: 'instagram', label: 'instagram', val: '@serkankorkut' },
        { k: 'facebook', label: 'facebook', val: '/serkankorkut' },
      ],
      lookingHead: '// looking_for',
      lookingTitle: 'What I\'m up for',
      yes: 'Yes please',
      no: 'Not right now',
      yesItems: [
        'Banks or e-money / payment institutions exploring our services',
        'Integration questions on FAST, BKM, EFT or SWIFT',
        'Open-source collabs & code reviews',
        'Coffee chats with other backend / payments folks',
      ],
      noItems: [
        'Crypto / web3 token launches',
        'Cold recruiter spam without context',
        'Vendor pitches — please go through MapaGlobal',
      ],
      faqHead: '// faq.md',
      faqTitle: 'Often asked',
      faq: [
        { q: 'Where do you work?', a: 'Backend Engineer at MapaGlobal. Our team maintains and evolves the payment-integration services that connect to Turkey\'s rails (FAST, BKM, EFT) and SWIFT, and we provide technical support to the banks and licensed e-money / payment institutions that consume them.' },
        { q: 'What does your day look like?', a: 'Mostly extending and patching existing services as new requirements come in, debugging integration issues, and supporting the institutions that use us — message-level investigations, schema tweaks, performance fixes.' },
        { q: 'What\'s your stack sweet spot?', a: 'Java / Spring Boot, MSSQL and Oracle on the day job. Node.js, .NET and Python on the side. SQL, integrations and message contracts are where I spend most of my time.' },
        { q: 'How fast do you reply?', a: 'Within 24 hours on weekdays, usually faster. If it\'s urgent, mention it in the subject and I\'ll prioritize.' },
      ],
      respTitle: 'Response time',
      respVal: 'usually < 24h',
      respSub: 'Mon–Fri, GMT+3',
    },
    tr: {
      tag: '// iletisim.sh',
      title: 'İletişime geç',
      sub: 'MapaGlobal\'da backend engineer. İşbirliği soruları, entegrasyon desteği veya sadece selam için yaz.',
      fields: { name: 'isim', email: 'email', message: 'mesaj' },
      send: './mesaj_gonder.sh',
      cards: [
        { k: 'email', label: 'email', val: 'serkan@serkankorkut.dev' },
        { k: 'location', label: 'konum', val: 'İstanbul, Türkiye' },
        { k: 'github', label: 'github', val: '@serkankorkut' },
        { k: 'linkedin', label: 'linkedin', val: 'in/serkankorkut' },
        { k: 'instagram', label: 'instagram', val: '@serkankorkut' },
        { k: 'facebook', label: 'facebook', val: '/serkankorkut' },
      ],
      lookingHead: '// aradığım',
      lookingTitle: 'Ne arıyorum',
      yes: 'Evet, lütfen',
      no: 'Şu an değil',
      yesItems: [
        'Servislerimizi değerlendiren banka / EPÖ kuruluşları',
        'FAST, BKM, EFT veya SWIFT entegrasyon soruları',
        'Açık kaynak işbirlikleri & code review',
        'Backend / ödeme sistemleri üzerine sohbet',
      ],
      noItems: [
        'Crypto / web3 token launchleri',
        'Bağlamsız soğuk recruiter mesajları',
        'Satıcı teklifleri — lütfen MapaGlobal\'dan geçirin',
      ],
      faqHead: '// sss.md',
      faqTitle: 'Sıkça sorulanlar',
      faq: [
        { q: 'Nerede çalışıyorsun?', a: 'MapaGlobal\'da Backend Engineer. Ekibimiz Turkiye\'nin ödeme altyapılarına (FAST, BKM, EFT) ve sınır ötesi için SWIFT\'e bağlanan ödeme entegrasyonu servislerinin bakımını yapıyor; hizmet sunduğumuz banka ve lisanslı elektronik para / ödeme kuruluşlarına teknik destek sağlıyoruz.' },
        { q: 'Günün nasıl geçiyor?', a: 'Genelde yeni gereksinimler geldiğinde mevcut servisleri geliştirmek/yamamak, entegrasyon sorunlarını debug etmek ve hizmet sunduğumuz kuruluşlara destek vermek — mesaj seviyesinde incelemeler, şema düzenlemeleri, performans çözümleri.' },
        { q: 'Hangi stack\'te en iyisin?', a: 'İş yerinde Java / Spring Boot, MSSQL ve Oracle. Yan tarafta Node.js, .NET ve Python. SQL, entegrasyonlar ve mesaj kontratları en çok vakit geçirdiğim alanlar.' },
        { q: 'Ne kadar hızlı dönüyorsun?', a: 'Hafta içi 24 saat içinde, genelde daha hızlı. Aciliyet varsa konuda belirt, öne alırım.' },
      ],
      respTitle: 'Yanıt süresi',
      respVal: 'genelde < 24s',
      respSub: 'Pzt–Cum, GMT+3',
    },
  }[lang];

  const inputStyle = {
    width: '100%', background: t.bgInset, border: `1px solid ${t.border}`,
    borderRadius: 4, padding: '12px 14px', fontFamily: MONO, fontSize: 14,
    color: t.fg, outline: 'none',
  };

  return (
    <section data-sk="section" style={{
      background: t.bgInset, color: t.fg, fontFamily: MONO,
      padding: '96px 32px', borderBottom: `1px solid ${t.border}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Heading */}
        <div data-sk="contact-head" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, marginBottom: 56, alignItems: 'end' }}>
          <div>
            <div data-sk="section-tag" style={{ fontSize: 11, color: t.accent, letterSpacing: '0.18em', marginBottom: 16 }}>
              {content.tag}
            </div>
            <h2 data-sk="section-title" style={{
              fontFamily: DISPLAY, fontSize: 56, lineHeight: 1, fontWeight: 800,
              letterSpacing: '-0.03em', margin: 0,
            }}>{content.title}</h2>
          </div>
          <p style={{ fontSize: 16, color: t.fgMuted, margin: 0, maxWidth: 480, justifySelf: 'end' }}>
            {content.sub}
          </p>
        </div>

        <div data-sk="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Form */}
          <div style={{
            background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 6,
            overflow: 'hidden',
          }}>
            <div style={{
              height: 32, background: t.bgInset, borderBottom: `1px solid ${t.border}`,
              display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 11, color: t.fgFaint }}>~/message.txt</div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, color: t.fgFaint, letterSpacing: '0.1em' }}>
                  <span style={{ color: t.accent }}>$</span> {content.fields.name}
                </span>
                <input style={inputStyle} placeholder="Ada Lovelace" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, color: t.fgFaint, letterSpacing: '0.1em' }}>
                  <span style={{ color: t.accent }}>$</span> {content.fields.email}
                </span>
                <input style={inputStyle} placeholder="ada@example.com" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, color: t.fgFaint, letterSpacing: '0.1em' }}>
                  <span style={{ color: t.accent }}>$</span> {content.fields.message}
                </span>
                <textarea
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                  placeholder={lang === 'en' ? 'Tell me about your project…' : 'Projenden bahset…'}
                />
              </label>
              <button style={{
                marginTop: 8, background: t.accent, color: '#000', border: 'none',
                padding: '14px 20px', fontFamily: MONO, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', borderRadius: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>{content.send}</span>
                <span>↵</span>
              </button>
            </div>
          </div>

          {/* Cards */}
          <div data-sk="contact-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignContent: 'start' }}>
            {content.cards.map((c) => (
              <div key={c.k} style={{
                background: t.bgElevated, border: `1px solid ${t.border}`,
                borderRadius: 6, padding: '24px', cursor: 'pointer',
                transition: 'border-color .15s, transform .15s',
                display: 'flex', flexDirection: 'column', gap: 10,
                minHeight: 140,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; }}
              >
                <div style={{ fontSize: 11, color: t.fgFaint, letterSpacing: '0.15em' }}>
                  ./{c.label}
                </div>
                <div style={{ fontSize: 16, color: t.fg, fontWeight: 600, marginTop: 'auto' }}>
                  {c.val}
                </div>
                <div style={{ fontSize: 12, color: t.accent }}>open →</div>
              </div>
            ))}
          </div>
        </div>

        {/* What I'm looking for */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontSize: 11, color: t.accent, letterSpacing: '0.18em', marginBottom: 12 }}>
            {content.lookingHead}
          </div>
          <h3 style={{
            fontFamily: DISPLAY, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em',
            margin: '0 0 24px', color: t.fg,
          }}>{content.lookingTitle}</h3>

          <div data-sk="contact-looking" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* YES */}
            <div style={{
              background: t.bgElevated, border: `1px solid ${t.border}`,
              borderRadius: 6, padding: '24px', borderLeft: `3px solid ${t.accent}`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
                paddingBottom: 12, borderBottom: `1px dashed ${t.border}`,
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 3, background: t.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#000',
                }}>✓</span>
                <span style={{ color: t.fg, fontWeight: 600, fontSize: 14 }}>{content.yes}</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {content.yesItems.map((it, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: t.fgMuted, lineHeight: 1.5 }}>
                    <span style={{ color: t.accent }}>›</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NO */}
            <div style={{
              background: t.bgElevated, border: `1px solid ${t.border}`,
              borderRadius: 6, padding: '24px', borderLeft: `3px solid ${t.borderStrong}`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
                paddingBottom: 12, borderBottom: `1px dashed ${t.border}`,
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 3, background: t.bgInset,
                  border: `1px solid ${t.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: t.fgMuted,
                }}>✗</span>
                <span style={{ color: t.fg, fontWeight: 600, fontSize: 14 }}>{content.no}</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {content.noItems.map((it, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: t.fgFaint, lineHeight: 1.5, textDecoration: 'line-through', textDecorationColor: t.borderStrong }}>
                    <span style={{ color: t.fgFaint, textDecoration: 'none' }}>›</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontSize: 11, color: t.accent, letterSpacing: '0.18em', marginBottom: 12 }}>
            {content.faqHead}
          </div>
          <h3 style={{
            fontFamily: DISPLAY, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em',
            margin: '0 0 24px', color: t.fg,
          }}>{content.faqTitle}</h3>

          <div style={{
            background: t.bgElevated, border: `1px solid ${t.border}`,
            borderRadius: 6, overflow: 'hidden',
          }}>
            {content.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} style={{ borderBottom: i < content.faq.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                      padding: '20px 24px', background: open ? t.bgInset : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontFamily: MONO, color: t.fg,
                    }}
                  >
                    <span style={{ color: t.accent, fontSize: 13, fontWeight: 700, minWidth: 28 }}>
                      Q{String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{f.q}</span>
                    <span style={{ color: t.fgMuted, fontSize: 16 }}>{open ? '–' : '+'}</span>
                  </button>
                  {open && (
                    <div style={{
                      padding: '0 24px 24px 68px', fontSize: 13, lineHeight: 1.7,
                      color: t.fgMuted, background: t.bgInset,
                    }}>
                      <span style={{ color: t.accent }}>›</span> {f.a}
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
window.Contact = Contact;

function Footer({ theme, lang }) {
  const t = TOKENS[theme];
  const isEn = lang === 'en';

  const cols = [
    {
      head: isEn ? 'navigate' : 'gezin',
      items: [
        { l: isEn ? 'home' : 'anasayfa', cmd: '~' },
        { l: 'projects', cmd: 'projects/' },
        { l: 'contact', cmd: 'contact.sh' },
      ],
    },
    {
      head: isEn ? 'connect' : 'bağlan',
      items: [
        { l: 'github', cmd: '@serkankorkut' },
        { l: 'linkedin', cmd: 'in/serkankorkut' },
        { l: 'email', cmd: 'serkan@…' },
      ],
    },
    {
      head: isEn ? 'now' : 'şimdi',
      items: [
        { l: isEn ? 'working' : 'çalışıyor', cmd: '@ MapaGlobal' },
        { l: isEn ? 'building' : 'inşa ediyor', cmd: 'FAST · BKM · EFT · SWIFT' },
        { l: isEn ? 'location' : 'konum', cmd: 'İstanbul, TR' },
      ],
    },
  ];

  return (
    <footer style={{
      background: t.bg, color: t.fgMuted, fontFamily: MONO,
      borderTop: `1px solid ${t.border}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 24px' }}>

        {/* Top — big wordmark + columns */}
        <div data-sk="footer-grid" style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48,
          paddingBottom: 48, borderBottom: `1px dashed ${t.border}`,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 28, height: 28, background: t.accent, borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: MONO, fontWeight: 700, fontSize: 14, color: '#0c0d0f',
              }}>[S]</div>
              <span style={{ color: t.fg, fontWeight: 600, fontSize: 15 }}>serkankorkut</span>
              <span style={{ color: t.fgFaint, fontSize: 15 }}>.dev</span>
            </div>
            <p style={{
              margin: 0, fontSize: 13, lineHeight: 1.7, color: t.fgMuted, maxWidth: 320,
            }}>
              {isEn
                ? 'Backend engineer @ MapaGlobal. Maintaining payment-integration services on FAST, BKM, EFT and SWIFT, and supporting the banks and e-money / payment institutions that use them.'
                : "MapaGlobal'da backend engineer. FAST, BKM, EFT ve SWIFT üzerine kurulu ödeme entegrasyonu servislerimizin bakımını yapıyor, hizmet sunduğumuz banka ve EPÖ kuruluşlarına teknik destek sağlıyor."}
            </p>
            {/* status pill */}
            <div style={{
              marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 999, background: t.bgInset,
              border: `1px solid ${t.border}`, fontSize: 11, color: t.fgMuted,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: t.accent,
                boxShadow: `0 0 8px ${t.accent}`,
              }} />
              {isEn ? 'backend engineer @ MapaGlobal' : 'MapaGlobal\'da backend engineer'}
            </div>
          </div>

          {/* Columns */}
          {cols.map((c) => (
            <div key={c.head}>
              <div style={{
                fontSize: 11, color: t.accent, letterSpacing: '0.18em', marginBottom: 18,
              }}>// {c.head}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {c.items.map((it, i) => (
                  <li key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 11, color: t.fgFaint, letterSpacing: '0.05em' }}>
                      ./{it.l}
                    </span>
                    <span style={{ fontSize: 13, color: t.fg }}>{it.cmd}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Big wordmark — typographic accent */}
        <div style={{
          padding: '40px 0 24px', position: 'relative', overflow: 'hidden',
        }}>
          <div data-sk="footer-wordmark" style={{
            fontFamily: DISPLAY, fontWeight: 800,
            fontSize: 'clamp(72px, 13vw, 168px)', lineHeight: 0.85,
            letterSpacing: '-0.05em',
            color: 'transparent',
            WebkitTextStroke: `1px ${t.borderStrong}`,
            userSelect: 'none', textAlign: 'center',
          }}>
            SERKANKORKUT<span style={{ color: t.accent, WebkitTextStroke: `1px ${t.accent}` }}>.</span>DEV
          </div>
        </div>

        {/* Bottom strip */}
        <div data-sk="footer-bottom" style={{
          paddingTop: 20, borderTop: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          fontSize: 11, color: t.fgFaint, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: t.accent }}>$</span>
            <span>echo "© 2026 Serkan Korkut · {isEn ? 'all rights reserved' : 'tüm hakları saklıdır'}"</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>{isEn ? 'view source: ' : 'kaynak: '}
              <a
                href="https://github.com/serkankorkut17"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: t.fgMuted, textDecoration: 'none', borderBottom: `1px dashed ${t.borderStrong}` }}
                onMouseEnter={(e) => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderBottomColor = t.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = t.fgMuted; e.currentTarget.style.borderBottomColor = t.borderStrong; }}
              >github.com/serkankorkut17</a>
            </span>
            <span style={{ color: t.borderStrong }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: t.accent,
              }} />
              v2026.05
            </span>
          </div>
        </div>

      </div>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </footer>
  );
}
window.Footer = Footer;
