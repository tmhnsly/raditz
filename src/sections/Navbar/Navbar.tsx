'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Frame } from '../../lib/Frame';
import { ColorSchemeToggle } from '../../lib/ColorSchemeToggle';
import { Overlay } from '../../components/internal';
import { SectionActions, SectionActionButton, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';

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
        <SectionActionButton key={i} action={action} size={size} />
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

/**
 * The primary-nav links with an animated active indicator: a pill that slides to
 * the hovered link and rests on the one matching the current route. Route-aware
 * with no router dependency — it reads `location.pathname` on mount (an explicit
 * `activeHref` wins). Falls back gracefully (indicator hidden) when nothing
 * matches or before hydration.
 */
function NavLinks({ links, activeHref }: { links: NavbarLink[]; activeHref?: string }) {
  const wrapRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(activeHref ?? null);
  const [ind, setInd] = useState<{ x: number; w: number; show: boolean }>({ x: 0, w: 0, show: false });

  useEffect(() => {
    if (activeHref !== undefined) { setActive(activeHref); return; }
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    const exact = links.find((l) => typeof l.href === 'string' && l.href === path);
    const nested = links.find((l) => typeof l.href === 'string' && l.href !== '/' && path.startsWith(l.href));
    setActive((exact ?? nested)?.href ?? null);
  }, [links, activeHref]);

  const move = useCallback((el: HTMLElement | null) => {
    const wrap = wrapRef.current;
    if (!wrap || !el) return;
    const w = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setInd({ x: r.left - w.left, w: r.width, show: true });
  }, []);

  const rest = useCallback(() => {
    const el = wrapRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    if (el) move(el);
    else setInd((s) => ({ ...s, show: false }));
  }, [move]);

  // Settle the indicator on the active link whenever it (or the link set) changes.
  useEffect(() => { rest(); }, [active, links, rest]);

  return (
    <nav className="rdz-nav__links" ref={wrapRef} onMouseLeave={rest}>
      <span className="rdz-nav__ind" aria-hidden="true" data-show={ind.show ? 'true' : 'false'} style={{ '--nav-x': `${ind.x}px`, '--nav-w': `${ind.w}px` } as CSSProperties} />
      {links.map((link, i) => (
        <a
          key={i}
          href={link.href}
          data-active={active === link.href ? 'true' : undefined}
          aria-current={active === link.href ? 'page' : undefined}
          onMouseEnter={(e) => move(e.currentTarget)}
          onFocus={(e) => move(e.currentTarget)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * NavbarA — the default top nav: a compact, floating **glass pill** that re-themes
 * with the accent. A preset over `NavCore` with the animated route-aware active
 * indicator and a built-in light/dark toggle switched on. Collapses links into a
 * burger sheet on narrow widths. `activeHref` overrides route auto-detection.
 */
export function NavbarA({ brand, links, actions, children, activeHref }: NavbarProps & { activeHref?: string }) {
  return (
    <NavCore
      brand={brand}
      links={links}
      actions={actions}
      activeHref={activeHref}
      animatedLinks
      showToggle
      frameClassName="nav-section rdz-nav__frame"
      padClassName="s-pad-sm"
      barClassName="rdz-nav rdz-nav--pill"
      brandRowClassName="sx-nav__brand-row-sm"
      logoClassName="sx-nav__logo-md"
      glyphClassName="sx-nav__logo-glyph-md"
      endClassName="rdz-nav__end"
      actionSize="sm"
    >
      {children}
    </NavCore>
  );
}

/** Shared bar + burger + NavSheet wiring, parameterized by the per-variant
 * classes, action size, and two behavioural toggles (animated active links, a
 * color-scheme toggle). NavbarA/B/C are thin presets over this — one core owns
 * the open-state + sheet + brand + actions machinery, so it lives in one place. */
function NavCore({
  brand,
  links,
  actions,
  children,
  frameClassName,
  frameMaxWidth,
  padClassName,
  barClassName,
  brandRowClassName,
  logoClassName,
  glyphClassName,
  actionSize,
  footer,
  endClassName = 'nav-bar__cta',
  animatedLinks = false,
  showToggle = false,
  activeHref,
}: {
  brand: NavbarBrand;
  links?: NavbarLink[];
  actions?: SectionAction[];
  children?: ReactNode;
  frameClassName: string;
  frameMaxWidth?: string;
  padClassName: string;
  barClassName: string;
  brandRowClassName: string;
  logoClassName: string;
  glyphClassName: string;
  actionSize?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
  /** Class on the right-hand cluster (toggle + actions + burger). */
  endClassName?: string;
  /** Render links with the sliding active indicator (`NavLinks`) vs plain links. */
  animatedLinks?: boolean;
  /** Ship a light/dark `ColorSchemeToggle` in the cluster. */
  showToggle?: boolean;
  /** Explicit active route for the indicator (else auto-detected). */
  activeHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  return (
    <Frame maxWidth={frameMaxWidth} className={frameClassName}>
      <div className={padClassName}>
        <div className="s-wrap navcq">
          {children ?? (
            <>
              <div className={barClassName}>
                <div className={'row ' + brandRowClassName}>
                  <BrandLockup brand={brand} logoClassName={logoClassName} glyphClassName={glyphClassName} />
                </div>
                {links && links.length > 0 && (
                  animatedLinks ? (
                    <NavLinks links={links} activeHref={activeHref} />
                  ) : (
                    <nav className="nav-bar__links">
                      {links.map((link, i) => (
                        <a key={i} href={link.href}>{link.label}</a>
                      ))}
                    </nav>
                  )
                )}
                <div className={endClassName}>
                  {showToggle && <ColorSchemeToggle />}
                  <BarActions actions={actions} size={actionSize} />
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
      {footer}
    </Frame>
  );
}

export function NavbarB({ brand, links, actions, children }: NavbarProps) {
  return (
    <NavCore
      brand={brand}
      links={links}
      actions={actions}
      frameClassName="ph--neutral sx-nav__frame-b nav-section"
      padClassName="s-pad-sm"
      barClassName="nav-bar sx-nav__bar-glass"
      brandRowClassName="sx-nav__brand-row-sm"
      logoClassName="sx-nav__logo-md"
      glyphClassName="sx-nav__logo-glyph-md"
      actionSize="sm"
    >
      {children}
    </NavCore>
  );
}

export function NavbarC({ brand, links, actions, children }: NavbarProps) {
  return (
    <NavCore
      brand={brand}
      links={links}
      actions={actions}
      frameClassName="nav-section"
      frameMaxWidth="22.5rem"
      padClassName="sx-nav__pad"
      barClassName="nav-bar"
      brandRowClassName="sx-nav__brand-row-sm"
      logoClassName="sx-nav__logo-md"
      glyphClassName="sx-nav__logo-glyph-md"
      footer={
        <div className="muted sx-nav__note">
          Frame ≈ 360px — links collapse into the burger dropdown. Tap the menu icon to toggle.
        </div>
      }
    >
      {children}
    </NavCore>
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
