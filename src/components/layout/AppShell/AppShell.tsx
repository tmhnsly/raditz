'use client';
import * as React from 'react';
import { cx, useControllableState } from '../../internal';

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Overall arrangement: a side sidebar (docs/app) or a horizontal top bar
   *  (marketing/app-with-top-nav). The same `nav`/`brand`/`actions` slots feed
   *  both, so a project can swap layouts without rewiring its navigation. @default 'sidebar' */
  layout?: 'sidebar' | 'topbar';
  /** Brand / logo block. */
  brand?: React.ReactNode;
  /** Optional search slot. */
  search?: React.ReactNode;
  /** Navigation — a vertical `<Tree>` for `sidebar`, a horizontal nav for `topbar`. */
  nav?: React.ReactNode;
  /** Pinned footer (sidebar bottom, or a bottom bar in `topbar`). */
  footer?: React.ReactNode;
  /** Left of the top bar (sidebar) / the sub-bar (topbar) — breadcrumbs or title. */
  breadcrumbs?: React.ReactNode;
  /** Top-bar actions (theme toggle, profile, …). */
  actions?: React.ReactNode;
  children?: React.ReactNode;
  /** Sidebar width (sidebar layout). @default '15rem' */
  railWidth?: string;
  /** Which side the sidebar sits on (sidebar layout). @default 'left' */
  side?: 'left' | 'right';
  /** Spacing density. @default 'comfortable' */
  density?: 'comfortable' | 'compact';
  /** Show a desktop toggle that collapses the sidebar (sidebar layout). @default false */
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const Burger = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const PanelIcon = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="9" y1="4" x2="9" y2="20" />
  </svg>
);

/**
 * AppShell — a reusable app/docs layout with a swappable arrangement:
 * `layout="sidebar"` (a fixed sidebar of brand + search + nav + footer beside a
 * scrolling content column with a sticky breadcrumb bar) or `layout="topbar"`
 * (brand + horizontal nav + actions across the top, content below). Both read the
 * same slots, so a project keeps one set of nav config and just swaps the shell.
 * Configurable `side`, `density`, `railWidth`, and an optional `collapsible`
 * sidebar; collapses to an off-canvas drawer on mobile. Fills its container — give
 * it a `height: 100vh` parent for a full app, or a fixed-height box to embed.
 */
export function AppShell({
  layout = 'sidebar',
  brand,
  search,
  nav,
  footer,
  breadcrumbs,
  actions,
  children,
  railWidth = '15rem',
  side = 'left',
  density = 'comfortable',
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
  style,
  ...rest
}: AppShellProps): React.ReactElement {
  const [navOpen, setNavOpen] = React.useState(false);
  const [isCollapsed, setCollapsed] = useControllableState<boolean>({
    value: collapsed,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  });

  if (layout === 'topbar') {
    return (
      <div className={cx('rdz-appshell', className)} data-layout="topbar" data-density={density} style={style} {...rest}>
        <header className="rdz-appshell__bar">
          {brand && <div className="rdz-appshell__brand">{brand}</div>}
          {nav && <nav className="rdz-appshell__topnav" aria-label="Primary">{nav}</nav>}
          {search && <div className="rdz-appshell__topsearch">{search}</div>}
          {actions && <div className="rdz-appshell__actions">{actions}</div>}
        </header>
        {breadcrumbs && <div className="rdz-appshell__subbar">{breadcrumbs}</div>}
        <main className="rdz-appshell__content">{children}</main>
        {footer && <footer className="rdz-appshell__topfooter">{footer}</footer>}
      </div>
    );
  }

  return (
    <div
      className={cx('rdz-appshell', isCollapsed && 'is-collapsed', navOpen && 'is-nav-open', className)}
      data-layout="sidebar"
      data-side={side}
      data-density={density}
      style={{ '--rdz-appshell-rail': railWidth, ...style } as React.CSSProperties}
      {...rest}
    >
      <div className="rdz-appshell__scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />
      <aside className="rdz-appshell__rail">
        {(brand || search) && (
          <div className="rdz-appshell__rail-head">
            {brand && <div className="rdz-appshell__brand">{brand}</div>}
            {search}
          </div>
        )}
        <div className="rdz-appshell__nav">{nav}</div>
        {footer && <div className="rdz-appshell__footer">{footer}</div>}
      </aside>
      <div className="rdz-appshell__main">
        <header className="rdz-appshell__bar">
          <button type="button" className="rdz-appshell__burger" aria-label="Toggle navigation" aria-expanded={navOpen} onClick={() => setNavOpen((o) => !o)}>
            <Burger />
          </button>
          {collapsible && (
            <button type="button" className="rdz-appshell__collapse" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-pressed={isCollapsed} onClick={() => setCollapsed(!isCollapsed)}>
              <PanelIcon />
            </button>
          )}
          <div className="rdz-appshell__crumbs">{breadcrumbs}</div>
          {actions && <div className="rdz-appshell__actions">{actions}</div>}
        </header>
        <main className="rdz-appshell__content">{children}</main>
      </div>
    </div>
  );
}
