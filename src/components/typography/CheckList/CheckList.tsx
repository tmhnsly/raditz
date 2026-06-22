import type { ReactNode } from 'react';
import { cx } from '../../internal';

export interface CheckListProps {
  /** The items to list (strings or nodes). */
  items: ReactNode[];
  /** Lay out across this many columns (collapses to 1 on a narrow container). @default 1 */
  columns?: 1 | 2;
  /** Marker style. @default 'check' */
  marker?: 'check' | 'dot';
  className?: string;
}

/**
 * CheckList — a ticked feature list. The recurring "what's included" pattern:
 * a list of points, each led by an accent check (or dot), optionally in two
 * columns. A deep module so products stop hand-rolling `ul + icon + grid` CSS.
 */
export function CheckList({ items, columns = 1, marker = 'check', className }: CheckListProps) {
  return (
    <ul className={cx('rdz-checklist', columns === 2 && 'rdz-checklist--2col', className)}>
      {items.map((item, i) => (
        <li key={i} className="rdz-checklist__item">
          {marker === 'dot' ? (
            <span className="rdz-checklist__marker rdz-checklist__marker--dot" aria-hidden="true" />
          ) : (
            <span className="rdz-checklist__marker" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
