// Projects — terminal index list. Click row to expand.
function Projects({ theme, lang }) {
  const t = TOKENS[theme];
  const [openId, setOpenId] = React.useState('leave-master');

  const content = {
    en: { tag: '// projects.list', title: 'Selected work', sub: 'A focused index. Click any row to expand.' },
    tr: { tag: '// projects.list', title: 'Seçilmiş işler', sub: 'Odaklı bir index. Detay için bir satıra tıklayın.' },
  }[lang];

  const projects = [
    {
      id: 'leave-master', n: '01', year: '2024',
      name: 'Leave Master',
      kind: 'Full-stack · HR',
      stack: ['Next.js', 'TypeScript', '.NET Core', 'PostgreSQL'],
      desc: lang === 'en'
        ? 'Employee leave-management system with role-based dashboards, approvals, and audit trails. Designed the API contract and the frontend together for type-safe ergonomics.'
        : 'Rol tabanlı paneller, onay akışı ve denetim kaydı içeren çalışan izin yönetim sistemi. API kontratını ve frontend\'i birlikte tasarladım, tip güvenli ergonomi için.',
    },
    {
      id: 'fastapi-graphql', n: '02', year: '2024',
      name: 'FastAPI + GraphQL Service',
      kind: 'Backend · API',
      stack: ['Python', 'FastAPI', 'GraphQL', 'PostgreSQL'],
      desc: lang === 'en'
        ? 'A schema-first GraphQL service over FastAPI with cursor pagination, dataloaders, and JWT auth. Built as a reusable starter for future async Python projects.'
        : "FastAPI üzerinde schema-first GraphQL servisi: cursor pagination, dataloader ve JWT auth. Gelecekteki async Python projeleri için yeniden kullanılabilir bir başlangıç.",
    },
    {
      id: 'invoice', n: '03', year: '2023',
      name: 'Invoice & Payment',
      kind: 'Full-stack · Fintech',
      stack: ['Node.js', 'Express', 'MongoDB', 'Stripe'],
      desc: lang === 'en'
        ? 'Recurring billing with Stripe, PDF invoice generation, and a customer-facing portal. Idempotent webhooks and retry logic kept payment state consistent.'
        : 'Stripe ile recurring billing, PDF fatura ve müşteri portalı. Idempotent webhook ve retry mantığıyla ödeme durumu tutarlı tutuluyor.',
    },
    {
      id: 'cs2', n: '04', year: '2024',
      name: 'CS2 Nade Library',
      kind: 'Web app · Gaming',
      stack: ['Next.js', 'MongoDB', 'Cloudinary'],
      desc: lang === 'en'
        ? 'A community library of CS2 grenade lineups with map filters, video previews, and admin moderation. Cloudinary handles the media pipeline.'
        : 'CS2 nade lineup\'ları için topluluk kütüphanesi: harita filtreleri, video önizleme ve admin moderasyonu. Medya pipeline\'ı Cloudinary üzerinde.',
    },
    {
      id: 'texture', n: '05', year: '2023',
      name: 'Texture Mapping',
      kind: 'Graphics · Academic',
      stack: ['C++', 'OpenGL', 'GLSL'],
      desc: lang === 'en'
        ? 'A from-scratch texture mapping pipeline for an undergrad graphics course. UV unwrapping, mipmaps, anisotropic filtering — implemented to actually understand them.'
        : 'Lisans grafik dersi için sıfırdan texture mapping pipeline. UV unwrapping, mipmap, anisotropic filtering — gerçekten anlamak için implemente edildi.',
    },
    {
      id: 'robotics', n: '06', year: '2022',
      name: 'Autonomous Robotics',
      kind: 'Embedded · Academic',
      stack: ['C++', 'ROS', 'Arduino'],
      desc: lang === 'en'
        ? 'Line-following and obstacle-avoidance robot built for a competition. PID tuning, sensor fusion, and a lot of late nights.'
        : 'Yarışma için yapılmış çizgi takip ve engel kaçınma robotu. PID ayarı, sensör füzyonu ve çok sayıda geç gece.',
    },
  ];

  return (
    <section data-sk="section" style={{
      background: t.bg, color: t.fg, fontFamily: MONO,
      padding: '96px 32px', borderBottom: `1px solid ${t.border}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Heading */}
        <div data-sk="projects-head" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, marginBottom: 48, alignItems: 'end' }}>
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

        {/* Index list */}
        <div style={{
          border: `1px solid ${t.border}`, borderRadius: 6, overflow: 'hidden',
          background: t.bgElevated,
        }}>
          {/* Header row */}
          <div data-sk="projects-row" style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 1.4fr 1.6fr 80px',
            padding: '12px 24px', borderBottom: `1px solid ${t.border}`,
            background: t.bgInset, fontSize: 11, color: t.fgFaint, letterSpacing: '0.1em',
          }}>
            <div>NO.</div>
            <div>YEAR</div>
            <div>PROJECT</div>
            <div data-sk="projects-row-stack">STACK</div>
            <div style={{ textAlign: 'right' }}>VIEW</div>
          </div>

          {projects.map((p, i) => {
            const open = openId === p.id;
            return (
              <div key={p.id} style={{ borderBottom: i < projects.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                <button
                  onClick={() => setOpenId(open ? null : p.id)}
                  data-sk="projects-row"
                  style={{
                    display: 'grid', width: '100%',
                    gridTemplateColumns: '60px 1fr 1.4fr 1.6fr 80px',
                    padding: '20px 24px', alignItems: 'center', gap: 16,
                    background: open ? t.bgInset : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    fontFamily: MONO, color: t.fg,
                    transition: 'background .15s',
                  }}
                  onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = t.bgInset; }}
                  onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ color: t.accent, fontSize: 13, fontWeight: 700 }}>{p.n}</div>
                  <div style={{ color: t.fgMuted, fontSize: 13 }}>{p.year}</div>
                  <div data-sk="projects-row-kind">
                    <div style={{ fontSize: 16, fontWeight: 600, color: t.fg }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: t.fgFaint, marginTop: 2 }}>{p.kind}</div>
                  </div>
                  <div data-sk="projects-row-stack" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {p.stack.map((s) => (
                      <span key={s} style={{
                        fontSize: 11, padding: '3px 8px', border: `1px solid ${t.border}`,
                        borderRadius: 3, color: t.fgMuted,
                      }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ textAlign: 'right', color: t.fgMuted, fontSize: 16 }}>
                    {open ? '–' : '+'}
                  </div>
                </button>

                {open && (
                  <div data-sk="projects-detail" style={{
                    padding: '0 24px 28px 84px', display: 'grid',
                    gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start',
                    background: t.bgInset,
                  }}>
                    <p style={{
                      margin: 0, fontSize: 14, lineHeight: 1.65, color: t.fgMuted,
                      maxWidth: 540,
                    }}>
                      {p.desc}
                    </p>
                    <div style={{
                      width: '100%', aspectRatio: '16 / 9', borderRadius: 4,
                      background: theme === 'dark'
                        ? 'repeating-linear-gradient(45deg, #15171a, #15171a 8px, #1a1c20 8px, #1a1c20 16px)'
                        : 'repeating-linear-gradient(45deg, #eeece6, #eeece6 8px, #f6f5f1 8px, #f6f5f1 16px)',
                      border: `1px solid ${t.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: t.fgFaint, fontSize: 11, letterSpacing: '0.1em',
                    }}>
                      [ PROJECT MEDIA ]
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
window.Projects = Projects;
