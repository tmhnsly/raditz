import * as React from 'react';
import { cx, sparklinePath } from '../../internal';

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
  if (data.length < 2) return null;
  const W = 100;
  const H = 32;
  const { line, area: fill } = sparklinePath(data, { w: W, h: H, pad: strokeWidth });
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
