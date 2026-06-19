import * as React from 'react';
import { cx } from '../../internal';

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data?: number[];
  width?: string;
  height?: string;
  strokeWidth?: number;
  /** Fill the area under the line. @default true */
  area?: boolean;
  /** Stroke/fill color. @default "var(--accent)" */
  color?: string;
}

/**
 * Sparkline — a tiny inline trend line (pure SVG). `data` is an array of
 * numbers; the line auto-scales to its min/max. `area` fills under the line.
 * Color comes from `currentColor` (defaults to the accent) — set `color` to
 * override. Width/height are CSS lengths.
 */
export function Sparkline({
  data = [],
  width = '7rem',
  height = '2rem',
  strokeWidth = 2,
  area = true,
  color = 'var(--accent)',
  className,
  style,
  ...rest
}: SparklineProps): React.ReactElement | null {
  const n = data.length;
  if (n < 2) return null;
  const W = 100;
  const H = 32;
  const pad = strokeWidth;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const x = (i: number): number => (i / (n - 1)) * W;
  const y = (v: number): number => H - pad - ((v - min) / span) * (H - pad * 2);
  const line = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(' ');
  const fill = `${line} L${W} ${H} L0 ${H} Z`;
  return (
    <svg
      className={cx('srx-sparkline', className)}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ '--srx-sparkline-w': width, '--srx-sparkline-h': height, '--srx-sparkline-color': color, ...style } as React.CSSProperties}
      aria-hidden="true"
      {...rest}
    >
      {area ? <path d={fill} fill="currentColor" opacity="0.12" stroke="none" /> : null}
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
