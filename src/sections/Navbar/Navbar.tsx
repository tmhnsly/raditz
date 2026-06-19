import { useState, useRef } from 'react';
import { Frame } from '../../lib/Frame';
import { useDismiss } from '../../components/internal';

const BurgerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export function NavbarA() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  useDismiss(navRef, open, () => setOpen(false));
  return (
    <Frame className="nav-frame">
      <div className="s-pad-sm">
        <div className="s-wrap navcq" ref={navRef} data-nav-open={open ? '' : undefined}>
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
                className="nav-bar__burger"
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
              >
                <BurgerIcon />
              </button>
            </div>
          </div>
          <div className="nav-sheet">
            <a href="#" onClick={() => setOpen(false)}>Product</a>
            <a href="#" onClick={() => setOpen(false)}>Solutions</a>
            <a href="#" onClick={() => setOpen(false)}>Pricing</a>
            <a href="#" onClick={() => setOpen(false)}>Docs</a>
            <div className="nav-sheet__cta">
              <button className="srx-btn srx-btn--ghost">Sign in</button>
              <button className="srx-btn srx-btn--primary">Get started</button>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function NavbarB() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  useDismiss(navRef, open, () => setOpen(false));
  return (
    <Frame className="ph--neutral sx-nav__frame-b nav-frame">
      <div className="s-pad-sm">
        <div className="s-wrap navcq" ref={navRef} data-nav-open={open ? '' : undefined}>
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
                className="nav-bar__burger"
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
              >
                <BurgerIcon />
              </button>
            </div>
          </div>
          <div className="nav-sheet">
            <a href="#" onClick={() => setOpen(false)}>Features</a>
            <a href="#" onClick={() => setOpen(false)}>Customers</a>
            <a href="#" onClick={() => setOpen(false)}>Pricing</a>
            <div className="nav-sheet__cta">
              <button className="srx-btn srx-btn--primary">Start free</button>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function NavbarC() {
  const [open, setOpen] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);
  useDismiss(navRef, open, () => setOpen(false));
  return (
    <Frame className="nav-frame" maxWidth="22.5rem">
      <div className="sx-nav__pad">
        <div className="s-wrap navcq" ref={navRef} data-nav-open={open ? '' : undefined}>
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
                className="nav-bar__burger"
                aria-label="Close menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
              >
                <BurgerIcon />
              </button>
            </div>
          </div>
          <div className="nav-sheet">
            <a href="#" onClick={() => setOpen(false)}>Product</a>
            <a href="#" onClick={() => setOpen(false)}>Solutions</a>
            <a href="#" onClick={() => setOpen(false)}>Pricing</a>
            <a href="#" onClick={() => setOpen(false)}>Docs</a>
            <div className="nav-sheet__cta">
              <button className="srx-btn srx-btn--ghost">Sign in</button>
              <button className="srx-btn srx-btn--primary">Get started</button>
            </div>
          </div>
        </div>
      </div>
      <div className="muted sx-nav__note">
        Frame ≈ 360px — links collapse into the burger dropdown. Tap the menu icon to toggle.
      </div>
    </Frame>
  );
}

export function Navbar() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Logo + links + CTAs</span><NavbarA /></div>
      <div className="variant"><span className="variant__tag">B · Glass, centered links</span><NavbarB /></div>
      <div className="variant"><span className="variant__tag">C · Mobile — links collapse into a dropdown menu</span><NavbarC /></div>
    </div>
  );
}
