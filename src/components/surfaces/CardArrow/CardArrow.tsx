import * as React from 'react';
import { cx } from '../../internal';

// In-site navigation → a horizontal right arrow.
const RightGlyph = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// External / opens-in-new-tab → an up-right diagonal arrow.
const UpRightGlyph = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="8 7 17 7 17 16" />
  </svg>
);

export interface CardArrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** External link (opens a new tab/window) → a diagonal up-right arrow; otherwise
   *  a horizontal right arrow for in-site navigation. @default false */
  external?: boolean;
}

/**
 * CardArrow — the consistent "this card is clickable" affordance. A horizontal
 * right arrow for in-site links, or an up-right diagonal arrow for external ones.
 * It gives a subtle nudge in its own direction when the host is hovered or
 * keyboard-focused (add `rdz-card-arrow-host` to the clickable wrapper). Decorative,
 * so it's `aria-hidden`.
 */
export function CardArrow({ external = false, className, ...rest }: CardArrowProps): React.ReactElement {
  return (
    <span className={cx('rdz-card-arrow', external && 'rdz-card-arrow--external', className)} aria-hidden="true" {...rest}>
      {external ? <UpRightGlyph /> : <RightGlyph />}
    </span>
  );
}
