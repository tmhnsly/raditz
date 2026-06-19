import type { HTMLAttributes, ReactElement } from 'react';
import { useControllableState } from '../../internal';
import { Icon } from '../../foundation/Icon/Icon';
import { cx } from '../../internal';

type PageEntry = number | '…';

/**
 * Build a FIXED-length page list so the control never changes width as you page.
 * For large totals it always returns `siblings*2 + 5` slots: near an end the
 * window expands to fill (no single-page ellipsis), in the middle both ends
 * ellipsise. Paired with equal-width slots in CSS, the layout stays put.
 */
function buildPages(page: number, total: number, siblings: number): PageEntry[] {
  const out: PageEntry[] = [];
  const range = (a: number, b: number): void => { for (let i = a; i <= b; i++) out.push(i); };
  const slots = siblings * 2 + 5;
  if (total <= slots) { range(1, total); return out; }
  const showLeftDots = page > siblings + 3;
  const showRightDots = page < total - (siblings + 2);
  if (!showLeftDots && showRightDots) {
    range(1, siblings * 2 + 3);
    out.push('…', total);
  } else if (showLeftDots && !showRightDots) {
    out.push(1, '…');
    range(total - (siblings * 2 + 2), total);
  } else {
    out.push(1, '…');
    range(page - siblings, page + siblings);
    out.push('…', total);
  }
  return out;
}

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
    <nav className={cx('srx-pagination', className)} aria-label="Pagination" {...rest}>
      <button type="button" className="srx-pagination__btn" aria-label="Previous page" disabled={p <= 1} onClick={() => go(p - 1)}><Icon name="chevron-left" size="1.1em" /></button>
      {pages.map((n, i) => n === '…'
        ? <span className="srx-pagination__gap" key={`g${i}`}>…</span>
        : <button type="button" key={n} className="srx-pagination__btn" data-active={n === p ? 'true' : undefined} aria-current={n === p ? 'page' : undefined} onClick={() => go(n)}>{n}</button>)}
      <button type="button" className="srx-pagination__btn" aria-label="Next page" disabled={p >= total} onClick={() => go(p + 1)}><Icon name="chevron-right" size="1.1em" /></button>
    </nav>
  );
}
