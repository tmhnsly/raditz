'use client';
import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { Frame } from '../../lib/Frame';
import { Overlay } from '../../components/internal';
import { Button } from '../../components/controls/Button';
import { SectionActions, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';

/** A brand lockup: a name plus an optional logo node, optionally a link. */
export interface NavbarBrand {
  /** Brand name / wordmark (required). */
  name: ReactNode;
  /** Optional logo / glyph rendered before the name. */
  logo?: ReactNode;
  /** Makes the lockup a link to this href. */
  href?: string;
}

/** A single top-nav link. */
export interface NavbarLink {
  label: ReactNode;
  href: string;
}

/**
 * Props for the top-nav variants (NavbarA/B/C): a required `brand` lockup, an
 * optional list of `links` (rendered in both the bar and the collapsed sheet),
 * and optional `actions` (CTAs, also rendered in both places). The `children`
 * escape hatch (from {@link SectionBaseProps}) replaces the whole bar body.
 */
export interface NavbarProps extends SectionBaseProps {
  /** Brand lockup (required). */
  brand: NavbarBrand;
  /** Primary nav links. */
  links?: NavbarLink[];
  /** Call-to-action buttons. */
  actions?: SectionAction[];
}

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

/** Renders the brand lockup, wrapping in a link when `brand.href` is set. When
 * no `logo` is supplied, the glyph falls back to a monogram (the first character
 * of a string `name`) — never the whole name, which already shows as the
 * wordmark beside it. */
function BrandLockup({ brand, logoClassName, glyphClassName }: {
  brand: NavbarBrand; logoClassName: string; glyphClassName: string;
}) {
  const initial = typeof brand.name === 'string' ? brand.name.trim().charAt(0) : null;
  const inner = (
    <>
      <span className={'feat-ico ' + logoClassName}>
        {brand.logo ?? (initial && <span className={glyphClassName}>{initial}</span>)}
      </span>
      <strong className="sx-nav__brand">{brand.name}</strong>
    </>
  );
  return brand.href ? (
    <a className="row sx-nav__brand-link" href={brand.href}>{inner}</a>
  ) : (
    inner
  );
}

/** The CTA buttons rendered in the bar — direct flex children of
 * `.nav-bar__cta` (alongside the burger), so the bar keeps its flat layout. */
function BarActions({ actions, size }: { actions?: SectionAction[]; size?: 'sm' | 'md' | 'lg' }) {
  if (!actions || actions.length === 0) return null;
  return (
    <>
      {actions.map((action, i) => (
        <Button
          key={i}
          href={action.href}
          onClick={action.onClick}
          variant={action.variant}
          size={action.size ?? size}
          icon={action.icon}
        >
          {action.label}
        </Button>
      ))}
    </>
  );
}

/** The links rendered inside the collapsed `NavSheet` (each closes the sheet). */
function SheetLinks({ links, actions, onClose }: {
  links?: NavbarLink[]; actions?: SectionAction[]; onClose: () => void;
}) {
  return (
    <>
      {links?.map((link, i) => (
        <a key={i} href={link.href} onClick={onClose}>{link.label}</a>
      ))}
      {actions && actions.length > 0 && (
        <SectionActions actions={actions} className="nav-sheet__cta" />
      )}
    </>
  );
}

export function NavbarA({ brand, links, actions, children }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  return (
    <Frame className="nav-section">
      <div className="s-pad-sm">
        <div className="s-wrap navcq">
          {children ?? (
            <>
              <div className="nav-bar">
                <div className="row sx-nav__brand-row">
                  <BrandLockup brand={brand} logoClassName="sx-nav__logo" glyphClassName="sx-nav__logo-glyph" />
                </div>
                {links && links.length > 0 && (
                  <nav className="nav-bar__links">
                    {links.map((link, i) => (
                      <a key={i} href={link.href}>{link.label}</a>
                    ))}
                  </nav>
                )}
                <div className="nav-bar__cta">
                  <BarActions actions={actions} />
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
                <SheetLinks links={links} actions={actions} onClose={() => setOpen(false)} />
              </NavSheet>
            </>
          )}
        </div>
      </div>
    </Frame>
  );
}

export function NavbarB({ brand, links, actions, children }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  return (
    <Frame className="ph--neutral sx-nav__frame-b nav-section">
      <div className="s-pad-sm">
        <div className="s-wrap navcq">
          {children ?? (
            <>
              <div className="nav-bar sx-nav__bar-glass">
                <div className="row sx-nav__brand-row-sm">
                  <BrandLockup brand={brand} logoClassName="sx-nav__logo-md" glyphClassName="sx-nav__logo-glyph-md" />
                </div>
                {links && links.length > 0 && (
                  <nav className="nav-bar__links">
                    {links.map((link, i) => (
                      <a key={i} href={link.href}>{link.label}</a>
                    ))}
                  </nav>
                )}
                <div className="nav-bar__cta">
                  <BarActions actions={actions} size="sm" />
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
                <SheetLinks links={links} actions={actions} onClose={() => setOpen(false)} />
              </NavSheet>
            </>
          )}
        </div>
      </div>
    </Frame>
  );
}

export function NavbarC({ brand, links, actions, children }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  return (
    <Frame maxWidth="22.5rem" className="nav-section">
      <div className="sx-nav__pad">
        <div className="s-wrap navcq">
          {children ?? (
            <>
              <div className="nav-bar">
                <div className="row sx-nav__brand-row-sm">
                  <BrandLockup brand={brand} logoClassName="sx-nav__logo-md" glyphClassName="sx-nav__logo-glyph-md" />
                </div>
                {links && links.length > 0 && (
                  <nav className="nav-bar__links">
                    {links.map((link, i) => (
                      <a key={i} href={link.href}>{link.label}</a>
                    ))}
                  </nav>
                )}
                <div className="nav-bar__cta">
                  <BarActions actions={actions} />
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
                <SheetLinks links={links} actions={actions} onClose={() => setOpen(false)} />
              </NavSheet>
            </>
          )}
        </div>
      </div>
      <div className="muted sx-nav__note">
        Frame ≈ 360px — links collapse into the burger dropdown. Tap the menu icon to toggle.
      </div>
    </Frame>
  );
}

/** A single bottom-tab-bar tab. */
export interface NavbarTab {
  /** Stable id used for the active state. */
  id: string;
  label: ReactNode;
  /** Icon node (e.g. an inline `<svg>` or an `<Icon>`). */
  icon?: ReactNode;
}

/**
 * Props for the bottom tab bar (NavbarD). Structurally a tab bar, not a top
 * nav, so it has its OWN type (no {@link SectionBaseProps} backdrop). Controlled
 * when `activeId` + `onTabChange` are supplied; otherwise it tracks the active
 * tab internally, defaulting to the first tab.
 */
export interface NavbarDProps {
  /** Tabs to render (required). */
  tabs: NavbarTab[];
  /** Controlled active tab id (pair with `onTabChange`). */
  activeId?: string;
  /** Called with the new tab id when a tab is selected. */
  onTabChange?: (id: string) => void;
}

/** D — an iOS/Android-style bottom tab bar: pinned to the bottom, icon+label
 * tabs with an accent active state. All Raditz tokens, so it re-themes. */
export function NavbarD({ tabs, activeId, onTabChange }: NavbarDProps) {
  const isControlled = activeId !== undefined;
  const [internalActive, setInternalActive] = useState(tabs[0]?.id);
  const active = isControlled ? activeId : internalActive;
  const select = (id: string) => {
    if (!isControlled) setInternalActive(id);
    onTabChange?.(id);
  };
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
              onClick={() => select(t.id)}
            >
              {t.icon && <span className="nav-tab__icon" aria-hidden="true">{t.icon}</span>}
              <span className="nav-tab__label">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </Frame>
  );
}
