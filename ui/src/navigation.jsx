// Navigation — terminal-style topbar + slide-in sidebar
function Navigation({ current, onNavigate, theme, onToggleTheme, lang, onToggleLang }) {
  const t = TOKENS[theme];
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const items = [
    { id: 'home', label: 'home', cmd: '~' },
    { id: 'projects', label: 'projects', cmd: 'projects/' },
    { id: 'contact', label: 'contact', cmd: 'contact.sh' },
  ];

  // Body scroll lock when sidebar open
  React.useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  // Close on Escape
  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const handleNav = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  // Brand block (used in topbar AND sidebar header)
  const Brand = ({ size = 'sm' }) => (
    <button
      onClick={() => handleNav('home')}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, background: 'transparent',
        border: 'none', cursor: 'pointer', color: t.fg, padding: 0, fontFamily: 'inherit',
      }}
    >
      <div style={{
        width: size === 'lg' ? 28 : 22, height: size === 'lg' ? 28 : 22,
        background: t.accent, color: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: size === 'lg' ? 16 : 13, fontFamily: DISPLAY, borderRadius: 3,
      }}>S</div>
      <span style={{ fontWeight: 600, color: t.fg, fontSize: size === 'lg' ? 15 : 13 }}>serkankorkut</span>
      <span style={{ color: t.fgFaint, fontSize: size === 'lg' ? 15 : 13 }}>.dev</span>
    </button>
  );

  return (
    <React.Fragment>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: t.bg, borderBottom: `1px solid ${t.border}`,
        fontFamily: MONO, fontSize: 13,
      }}>
        <div data-sk="nav" style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 56,
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          {/* Logo / brand */}
          <Brand />

          {/* Nav links — desktop */}
          <nav data-sk="nav-links" style={{ display: 'flex', gap: 4, marginLeft: 24 }}>
            {items.map((it) => {
              const active = current === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => handleNav(it.id)}
                  style={{
                    background: active ? t.bgInset : 'transparent',
                    color: active ? t.fg : t.fgMuted,
                    border: 'none', padding: '6px 12px', borderRadius: 4,
                    fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all .15s',
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = t.fg; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = t.fgMuted; }}
                >
                  <span style={{ color: active ? t.accent : t.fgFaint }}>./</span>
                  {it.label}
                </button>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div data-sk="nav-right" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Status pill */}
            <div data-sk="nav-status" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px', borderRadius: 999, background: t.bgInset,
              fontSize: 11, color: t.fgMuted,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: t.accent,
                boxShadow: `0 0 8px ${t.accent}`,
              }} />
              @ MapaGlobal
            </div>

            {/* Lang */}
            <button
              data-sk="nav-lang"
              onClick={onToggleLang}
              style={{
                background: 'transparent', border: `1px solid ${t.border}`,
                color: t.fgMuted, padding: '5px 10px', borderRadius: 4,
                fontFamily: 'inherit', fontSize: 11, cursor: 'pointer',
                display: 'flex', gap: 6,
              }}
            >
              <span style={{ color: lang === 'en' ? t.fg : t.fgFaint, fontWeight: lang === 'en' ? 600 : 400 }}>EN</span>
              <span style={{ color: t.fgFaint }}>/</span>
              <span style={{ color: lang === 'tr' ? t.fg : t.fgFaint, fontWeight: lang === 'tr' ? 600 : 400 }}>TR</span>
            </button>

            {/* Theme toggle */}
            <button
              data-sk="nav-theme"
              onClick={onToggleTheme}
              title="Toggle theme"
              style={{
                width: 30, height: 30, background: 'transparent', border: `1px solid ${t.border}`,
                color: t.fgMuted, borderRadius: 4, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>

            {/* Mobile/tablet menu button — only shown ≤960px via CSS */}
            <button
              data-sk="nav-mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              title="Menu"
              aria-label="Open menu"
              style={{
                display: 'none',
                width: 32, height: 32, background: 'transparent', border: `1px solid ${t.border}`,
                color: t.fgMuted, borderRadius: 4, cursor: 'pointer',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 18, lineHeight: 1,
              }}
            >
              ≡
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity .25s ease',
        }}
      />

      {/* Slide-in sidebar */}
      <aside
        data-sk="mobile-sidebar"
        aria-hidden={!mobileOpen}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 201,
          width: 'min(86vw, 320px)',
          background: t.bg,
          borderRight: `1px solid ${t.border}`,
          fontFamily: MONO,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .3s cubic-bezier(.22,.61,.36,1)',
          display: 'flex', flexDirection: 'column',
          boxShadow: mobileOpen ? '8px 0 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Sidebar header */}
        <div style={{
          height: 56, padding: '0 18px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', borderBottom: `1px solid ${t.border}`,
          background: t.bgInset,
        }}>
          <Brand size="lg" />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{
              width: 30, height: 30, background: 'transparent', border: `1px solid ${t.border}`,
              color: t.fgMuted, borderRadius: 4, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontFamily: 'inherit',
            }}
          >
            ✕
          </button>
        </div>

        {/* Section label */}
        <div style={{
          padding: '20px 18px 8px', fontSize: 10, color: t.fgFaint,
          letterSpacing: '0.18em',
        }}>
          // navigation
        </div>

        {/* Nav items */}
        <nav style={{
          padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {items.map((it) => {
            const active = current === it.id;
            return (
              <button
                key={it.id}
                onClick={() => handleNav(it.id)}
                style={{
                  background: active ? t.bgInset : 'transparent',
                  color: active ? t.fg : t.fgMuted,
                  border: 'none', padding: '14px 14px', borderRadius: 4,
                  fontFamily: 'inherit', fontSize: 15, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  textAlign: 'left',
                  borderLeft: `2px solid ${active ? t.accent : 'transparent'}`,
                }}
              >
                <span style={{ color: active ? t.accent : t.fgFaint, fontSize: 13 }}>./</span>
                <span style={{ flex: 1 }}>{it.label}</span>
                <span style={{ color: t.fgFaint, fontSize: 11 }}>{it.cmd}</span>
              </button>
            );
          })}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Status row */}
        <div style={{
          padding: '14px 18px', borderTop: `1px solid ${t.border}`,
          fontSize: 11, color: t.fgMuted,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: t.accent,
            boxShadow: `0 0 8px ${t.accent}`,
          }} />
          @ MapaGlobal
        </div>

        {/* Lang + Theme footer */}
        <div style={{
          padding: '14px 18px', borderTop: `1px solid ${t.border}`,
          background: t.bgInset,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ fontSize: 10, color: t.fgFaint, letterSpacing: '0.15em', flexShrink: 0 }}>
            // prefs
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={onToggleLang}
            style={{
              background: 'transparent', border: `1px solid ${t.border}`,
              color: t.fgMuted, padding: '7px 12px', borderRadius: 4,
              fontFamily: 'inherit', fontSize: 11, cursor: 'pointer',
              display: 'flex', gap: 6,
            }}
          >
            <span style={{ color: lang === 'en' ? t.fg : t.fgFaint, fontWeight: lang === 'en' ? 600 : 400 }}>EN</span>
            <span style={{ color: t.fgFaint }}>/</span>
            <span style={{ color: lang === 'tr' ? t.fg : t.fgFaint, fontWeight: lang === 'tr' ? 600 : 400 }}>TR</span>
          </button>

          <button
            onClick={onToggleTheme}
            title="Toggle theme"
            style={{
              width: 32, height: 32, background: 'transparent', border: `1px solid ${t.border}`,
              color: t.fgMuted, borderRadius: 4, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontFamily: 'inherit',
            }}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </aside>
    </React.Fragment>
  );
}
window.Navigation = Navigation;
