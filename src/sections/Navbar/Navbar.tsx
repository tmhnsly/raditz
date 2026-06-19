import { useState, useRef } from 'react';
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
    <Frame>
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
                aria-label="Open menu"
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
    <Frame className="ph--neutral sx-nav__frame-b">
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
                aria-label="Open menu"
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
    <Frame maxWidth="22.5rem">
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

export function Navbar() {
  return (
    <div className="col sx-gap-5">
      <div className="variant"><span className="variant__tag">A · Logo + links + CTAs</span><NavbarA /></div>
      <div className="variant"><span className="variant__tag">B · Glass, centered links</span><NavbarB /></div>
      <div className="variant"><span className="variant__tag">C · Mobile — links collapse into a dropdown menu</span><NavbarC /></div>
    </div>
  );
}
