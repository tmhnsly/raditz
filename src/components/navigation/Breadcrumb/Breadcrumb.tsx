import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { Icon } from '../../foundation/Icon/Icon';
import { cx } from '../../internal';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItem[];
}

/**
 * Breadcrumb — hierarchical trail. `items` is `[{ label, href? }]`; the last is
 * the current page. Separators are chevrons.
 */
export function Breadcrumb({ items = [], className, ...rest }: BreadcrumbProps): ReactElement {
  return (
    <nav className={cx('rdz-breadcrumb', className)} aria-label="Breadcrumb" {...rest}>
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li className="rdz-breadcrumb__item" key={i}>
              {it.href && !last
                ? <a href={it.href} className="rdz-breadcrumb__link">{it.label}</a>
                : <span className="rdz-breadcrumb__current" aria-current={last ? 'page' : undefined}>{it.label}</span>}
              {!last ? <Icon name="chevron-right" size="0.95em" className="rdz-breadcrumb__sep" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
