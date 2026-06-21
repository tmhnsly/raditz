'use client';
import * as React from 'react';
import { cx } from '../../internal';

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Brand / logo block at the top of the sidebar. */
  brand?: React.ReactNode;
  /** Optional search slot under the brand. */
  search?: React.ReactNode;
  /** Sidebar navigation — e.g. a `<Tree>`. */
  nav?: React.ReactNode;
  /** Left side of the top bar — a breadcrumb trail or page title. */
  breadcrumbs?: React.ReactNode;
  /** Right side of the top bar — actions (theme toggle, profile, …). */
  actions?: React.ReactNode;
  /** Main content. */
  children?: React.ReactNode;
  /** Sidebar width. @default '15rem' */
  railWidth?: string;
}

const Burger = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/**
 * AppShell — a reusable dashboard/docs layout: a fixed sidebar (brand + search +
 * nav) beside a scrolling content column with a sticky top bar (breadcrumbs +
 * actions). Fills its container (give it a `100vh` parent for a full app, or a
 * fixed-height box to embed), the nav and content scroll independently, and the
 * sidebar collapses to an off-canvas drawer on narrow screens. The same shell the
 * Raditz explorer is built from, generalised into slots.
 */
export function AppShell({
  brand,
  search,
  nav,
  breadcrumbs,
  actions,
  children,
  railWidth = '15rem',
  className,
  style,
  ...rest
}: AppShellProps): React.ReactElement {
  const [navOpen, setNavOpen] = React.useState(false);
  return (
    <div
      className={cx('rdz-appshell', navOpen && 'is-nav-open', className)}
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
      </aside>
      <div className="rdz-appshell__main">
        <header className="rdz-appshell__bar">
          <button
            type="button"
            className="rdz-appshell__burger"
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((o) => !o)}
          >
            <Burger />
          </button>
          <div className="rdz-appshell__crumbs">{breadcrumbs}</div>
          {actions && <div className="rdz-appshell__actions">{actions}</div>}
        </header>
        <main className="rdz-appshell__content">{children}</main>
      </div>
    </div>
  );
}
