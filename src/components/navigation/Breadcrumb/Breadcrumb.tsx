import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { Icon } from '../../display/Icon/Icon';
import { cx } from '../../internal';

export interface BreadcrumbItem {
  /** Visible text (or node) for this trail step. */
  label: ReactNode;
  /** Link target — omit on the last (current-page) item; it renders as plain text. */
  href?: string;
  /** Click handler for router-driven trails (renders a button when there's no
   * href). Ignored on the last (current-page) item. */
  onClick?: () => void;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Trail steps, root first; the last is the current page. @default [] */
  items?: BreadcrumbItem[];
  /** Separator between steps. Defaults to a chevron; pass e.g. "/" for a
   * slash trail. Rendered aria-hidden either way. */
  separator?: ReactNode;
}

/**
 * Breadcrumb — hierarchical trail. `items` is `[{ label, href?, onClick? }]`;
 * the last is the current page. Separators are chevrons by default
 * (`separator` overrides).
 */
export function Breadcrumb({ items = [], separator, className, ...rest }: BreadcrumbProps): ReactElement {
  const sep = separator !== undefined
    ? <span className="rdz-breadcrumb__sep" aria-hidden="true">{separator}</span>
    : <Icon name="chevron-right" size="0.95em" className="rdz-breadcrumb__sep" aria-hidden="true" />;
  return (
    <nav className={cx('rdz-breadcrumb', className)} aria-label="Breadcrumb" {...rest}>
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li className="rdz-breadcrumb__item" key={i}>
              {!last && it.href
                ? <a href={it.href} onClick={it.onClick} className="rdz-breadcrumb__link">{it.label}</a>
                : !last && it.onClick
                  ? <button type="button" onClick={it.onClick} className="rdz-breadcrumb__link">{it.label}</button>
                  : <span className="rdz-breadcrumb__current" aria-current={last ? 'page' : undefined}>{it.label}</span>}
              {!last ? sep : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
