import * as React from 'react';
import { cx, toPercent, donutDashes } from '../../internal';

export interface DonutSegment {
  value: number;
  color?: string;
  label?: React.ReactNode;
}

export interface DonutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Single-ring value (with `max`). */
  value?: number;
  /** @default 100 */
  max?: number;
  /** Multi-segment data (overrides `value`). */
  segments?: DonutSegment[];
  /** Diameter (CSS length). @default "8rem" */
  size?: string;
  /** Ring thickness in viewBox units. @default 12 */
  thickness?: number;
  trackColor?: string;
  /** Single-ring color. @default "var(--accent)" */
  color?: string;
  /** Centre label. */
  label?: React.ReactNode;
}

interface DonutPart {
  dash: number;
  gap: number;
  off: number;
  color: string;
  key: number;
}

/**
 * Donut — a ring chart (pure SVG) for a single percentage or multiple segments.
 * Pass `value` (+ optional `max`, default 100) for a single ring, or `segments`
 * (`[{ value, color?, label? }]`) for a multi-part donut. `label` renders in the
 * centre.
 */
export function Donut({
  value,
  max = 100,
  segments,
  size = '8rem',
  thickness = 12,
  trackColor = 'var(--surface-strong)',
  color = 'var(--accent)',
  label,
  className,
  style,
  ...rest
}: DonutProps): React.ReactElement {
  const R = 50;
  const r = R - thickness / 2;
  const C = 2 * Math.PI * r;
  let parts: DonutPart[];
  if (segments && segments.length) {
    parts = donutDashes(segments.map((s) => s.value), C).map((d, i) => ({
      dash: d.dash, gap: d.gap, off: d.offset, color: segments[i].color || 'var(--accent)', key: i,
    }));
  } else {
    const frac = toPercent(value || 0, max) / 100;
    parts = [{ dash: frac * C, gap: C - frac * C, off: 0, color, key: 0 }];
  }
  return (
    <div className={cx('rdz-donut', className)} style={{ '--rdz-donut-size': size, ...style } as React.CSSProperties} role="img" aria-label="Donut chart" {...rest}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke={trackColor} strokeWidth={thickness} />
        {parts.map((p) => (
          <circle
            key={p.key}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={p.color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${p.dash} ${p.gap}`}
            strokeDashoffset={p.off}
            transform="rotate(-90 50 50)"
          />
        ))}
      </svg>
      {label != null ? <div className="rdz-donut__label">{label}</div> : null}
    </div>
  );
}
