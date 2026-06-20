'use client';
import type { HTMLAttributes, ReactElement } from 'react';
import { useControllableState, buildPages, cx } from '../../internal';
import { Icon } from '../../foundation/Icon/Icon';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Total number of pages. @default 1 */
  total?: number;
  /** Current page, 1-based (controlled). */
  page?: number;
  /** Initial page (uncontrolled). @default 1 */
  defaultPage?: number;
  onChange?: (page: number) => void;
  /** Pages shown each side of the current one. @default 1 */
  siblings?: number;
}

/**
 * Pagination — page navigation with prev/next and an ellipsised page list.
 * Controlled with `page` / `onChange`, or uncontrolled with `defaultPage`.
 * `siblings` controls how many pages show around the current one.
 */
export function Pagination({ total = 1, page, defaultPage = 1, onChange, siblings = 1, className, ...rest }: PaginationProps): ReactElement {
  const [p, setP] = useControllableState<number>({ value: page, defaultValue: defaultPage, onChange });
  const go = (n: number): void => setP(Math.max(1, Math.min(total, n)));
  const pages = buildPages(p, total, siblings);
  return (
    <nav className={cx('rdz-pagination', className)} aria-label="Pagination" {...rest}>
      <button type="button" className="rdz-pagination__btn" aria-label="Previous page" disabled={p <= 1} onClick={() => go(p - 1)}><Icon name="chevron-left" size="1.1em" /></button>
      {pages.map((n, i) => n === '…'
        ? <span className="rdz-pagination__gap" key={`g${i}`}>…</span>
        : <button type="button" key={n} className="rdz-pagination__btn" data-active={n === p ? 'true' : undefined} aria-current={n === p ? 'page' : undefined} onClick={() => go(n)}>{n}</button>)}
      <button type="button" className="rdz-pagination__btn" aria-label="Next page" disabled={p >= total} onClick={() => go(p + 1)}><Icon name="chevron-right" size="1.1em" /></button>
    </nav>
  );
}
