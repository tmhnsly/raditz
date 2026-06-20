import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { cx } from './cx';

export interface OverlayCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label. @default "Close" */
  label?: string;
  /** Disc size: sm (compact, e.g. Toast), md (default), lg (full-screen, e.g. Lightbox). @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** @deprecated use `size="lg"`. Larger hit area for full-screen surfaces. */
  large?: boolean;
}

/**
 * The one close affordance shared by every overlay (Dialog, Drawer, Lightbox,
 * …). A circular icon button whose tint is derived from `currentColor`, so the
 * same component reads correctly on a light panel and on a dark scrim alike —
 * set the text color (or wrap in `.srx-on-dark`) and the disc follows.
 */
export function OverlayClose({ label = 'Close', size, large = false, className, ...rest }: OverlayCloseProps): ReactElement {
  const sz = size ?? (large ? 'lg' : 'md');
  return (
    <button type="button" aria-label={label} className={cx('srx-oclose', sz === 'lg' && 'srx-oclose--lg', sz === 'sm' && 'srx-oclose--sm', className)} {...rest}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </button>
  );
}
