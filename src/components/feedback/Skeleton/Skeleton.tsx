import * as React from 'react';
import { cx } from '../../internal';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Shape. @default "text" */
  variant?: 'text' | 'circle' | 'rect';
  /** CSS width. */
  width?: string;
  /** CSS height. */
  height?: string;
  /** For variant="text", number of lines (last is shortened). @default 1 */
  lines?: number;
  /** When false, renders children instead of the placeholder. @default true */
  loading?: boolean;
  /** Override border-radius. */
  radius?: string;
  children?: React.ReactNode;
}

/**
 * Skeleton — a shimmering placeholder for loading states. `variant` picks the
 * shape: 'text' (a line; use `lines` for a paragraph), 'circle', 'rect'. Size
 * with `width` / `height` (CSS lengths). Set `loading={false}` to render
 * `children` instead — handy as a wrapper.
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  loading = true,
  radius,
  className,
  children,
  style,
  ...rest
}: SkeletonProps): React.ReactElement | null {
  if (!loading) return children != null ? <>{children}</> : null;

  if (variant === 'text' && lines > 1) {
    return (
      <span className={cx('srx-skeleton-lines', className)} aria-hidden="true" {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={cx('srx-skeleton', 'srx-skeleton--text', i === lines - 1 && 'srx-skeleton--last')}
            style={i === lines - 1 ? undefined : ({ '--srx-skeleton-w': width || '100%' } as React.CSSProperties)}
          />
        ))}
      </span>
    );
  }

  const s = {
    '--srx-skeleton-w': width,
    '--srx-skeleton-h': height,
    '--srx-skeleton-radius': radius,
    ...style,
  } as React.CSSProperties;
  return <span className={cx('srx-skeleton', `srx-skeleton--${variant}`, className)} style={s} aria-hidden="true" {...rest} />;
}
