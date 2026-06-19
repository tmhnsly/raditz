import { useState, useRef } from 'react';
import type { ReactElement } from 'react';
import { Frame } from '../../lib/Frame';
import { Overlay } from '../../components/internal';

const BurgerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/** The collapsed-nav dropdown, anchored to the burger via the shared Overlay
 * (portaled, so it escapes the frame and positions like every other dropdown). */
function NavSheet({ open, onClose, anchor, children }: {
  open: boolean; onClose: () => void; anchor: React.RefObject<HTMLButtonElement | null>; children: React.ReactNode;
}) {
  return (
    <Overlay
      open={open}
      onDismiss={onClose}
      position={{ kind: 'anchored', anchor, side: 'bottom', align: 'end' }}
      ignore={anchor}
      focus="none"
      className="nav-sheet"
    >
      {children}
    </Overlay>
  );
}

export function NavbarA() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  return (
    <Frame className="nav-section">
      <div className="s-pad-sm">
        <div className="s-wrap navcq">
          <div className="nav-bar">
            <div className="row sx-nav__brand-row">
              <span className="feat-ico sx-nav__logo">
                <span className="sx-nav__logo-glyph">S</span>
              </span>
              <strong className="sx-nav__brand">SuperRadix</strong>
            </div>
            <nav className="nav-bar__links">
              <a href="#">Product</a>
              <a href="#">Solutions</a>
              <a href="#">Pricing</a>
              <a href="#">Docs</a>
            </nav>
            <div className="nav-bar__cta">
              <button className="srx-btn srx-btn--ghost nav-hide-sm">Sign in</button>
              <button className="srx-btn srx-btn--primary">Get started</button>
              <button
                ref={burgerRef}
                className="nav-bar__burger"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
              >
                <BurgerIcon />
              </button>
            </div>
          </div>
          <NavSheet open={open} onClose={() => setOpen(false)} anchor={burgerRef}>
            <a href="#" onClick={() => setOpen(false)}>Product</a>
            <a href="#" onClick={() => setOpen(false)}>Solutions</a>
            <a href="#" onClick={() => setOpen(false)}>Pricing</a>
            <a href="#" onClick={() => setOpen(false)}>Docs</a>
            <div className="nav-sheet__cta">
              <button className="srx-btn srx-btn--ghost">Sign in</button>
              <button className="srx-btn srx-btn--primary">Get started</button>
            </div>
          </NavSheet>
        </div>
      </div>
    </Frame>
  );
}

export function NavbarB() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  return (
    <Frame className="ph--neutral sx-nav__frame-b nav-section">
      <div className="s-pad-sm">
        <div className="s-wrap navcq">
          <div className="nav-bar sx-nav__bar-glass">
            <div className="row sx-nav__brand-row-sm">
              <span className="feat-ico sx-nav__logo-md">
                <span className="sx-nav__logo-glyph-md">S</span>
              </span>
              <strong>SuperRadix</strong>
            </div>
            <nav className="nav-bar__links">
              <a href="#">Features</a>
              <a href="#">Customers</a>
              <a href="#">Pricing</a>
            </nav>
            <div className="nav-bar__cta">
              <button className="srx-btn srx-btn--primary srx-btn--sm">Start free</button>
              <button
                ref={burgerRef}
                className="nav-bar__burger"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
              >
                <BurgerIcon />
              </button>
            </div>
          </div>
          <NavSheet open={open} onClose={() => setOpen(false)} anchor={burgerRef}>
            <a href="#" onClick={() => setOpen(false)}>Features</a>
            <a href="#" onClick={() => setOpen(false)}>Customers</a>
            <a href="#" onClick={() => setOpen(false)}>Pricing</a>
            <div className="nav-sheet__cta">
              <button className="srx-btn srx-btn--primary">Start free</button>
            </div>
          </NavSheet>
        </div>
      </div>
    </Frame>
  );
}

export function NavbarC() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  return (
    <Frame maxWidth="22.5rem" className="nav-section">
      <div className="sx-nav__pad">
        <div className="s-wrap navcq">
          <div className="nav-bar">
            <div className="row sx-nav__brand-row-sm">
              <span className="feat-ico sx-nav__logo-md">
                <span className="sx-nav__logo-glyph-md">S</span>
              </span>
              <strong>SuperRadix</strong>
            </div>
            <nav className="nav-bar__links">
              <a href="#">Product</a>
              <a href="#">Pricing</a>
              <a href="#">Docs</a>
            </nav>
            <div className="nav-bar__cta">
              <button className="srx-btn srx-btn--ghost nav-hide-sm">Sign in</button>
              <button className="srx-btn srx-btn--primary">Get started</button>
              <button
                ref={burgerRef}
                className="nav-bar__burger"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
              >
                <BurgerIcon />
              </button>
            </div>
          </div>
          <NavSheet open={open} onClose={() => setOpen(false)} anchor={burgerRef}>
            <a href="#" onClick={() => setOpen(false)}>Product</a>
            <a href="#" onClick={() => setOpen(false)}>Solutions</a>
            <a href="#" onClick={() => setOpen(false)}>Pricing</a>
            <a href="#" onClick={() => setOpen(false)}>Docs</a>
            <div className="nav-sheet__cta">
              <button className="srx-btn srx-btn--ghost">Sign in</button>
              <button className="srx-btn srx-btn--primary">Get started</button>
            </div>
          </NavSheet>
        </div>
      </div>
      <div className="muted sx-nav__note">
        Frame ≈ 360px — links collapse into the burger dropdown. Tap the menu icon to toggle.
      </div>
    </Frame>
  );
}

const TAB_ICONS: Record<string, ReactElement> = {
  home: <path d="M3 11.5 12 4l9 7.5M5 10v9h5v-5h4v5h5v-9" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  create: <><circle cx="12" cy="12" r="9" /><path d="M12 8.5v7M8.5 12h7" /></>,
  activity: <path d="M3 12h4l2.5 7 5-14L17 12h4" />,
  profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
};

/** D — an iOS/Android-style bottom tab bar: pinned to the bottom, icon+label
 * tabs with an accent active state. All SuperRadix tokens, so it re-themes. */
export function NavbarD() {
  const [active, setActive] = useState('home');
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'Search' },
    { id: 'create', label: 'Create' },
    { id: 'activity', label: 'Activity' },
    { id: 'profile', label: 'Profile' },
  ];
  return (
    <Frame maxWidth="22.5rem" className="nav-section">
      <div className="nav-tabframe">
        <div className="nav-tabframe__body">
          <div className="ph nav-tabframe__ph">app content</div>
        </div>
        <nav className="nav-tabbar" aria-label="Primary">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-current={active === t.id ? 'page' : undefined}
              className={'nav-tab' + (active === t.id ? ' is-active' : '')}
              onClick={() => setActive(t.id)}
            >
              <svg className="nav-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {TAB_ICONS[t.id]}
              </svg>
              <span className="nav-tab__label">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </Frame>
  );
}
