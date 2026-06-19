import * as React from 'react';
import { cx, minMax, toPercent } from '../../internal';

export interface BarDatum {
  label: React.ReactNode;
  value: number;
  color?: string;
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: BarDatum[];
  /** Horizontal bars. @default false */
  horizontal?: boolean;
  /** Print values on bars. @default true */
  showValues?: boolean;
  /** Chart height (vertical mode). @default "10rem" */
  height?: string;
}

/**
 * BarChart — a compact categorical bar chart (pure SVG/flex). `data` is
 * `[{ label, value, color? }]`. Bars use the accent unless a per-bar `color` is
 * given. `horizontal` flips orientation; `showValues` prints values.
 */
export function BarChart({
  data = [],
  horizontal = false,
  showValues = true,
  height = '10rem',
  className,
  style,
  ...rest
}: BarChartProps): React.ReactElement {
  const max = Math.max(minMax(data.map((d) => d.value)).max, 1);
  return (
    <div
      className={cx('srx-barchart', horizontal && 'srx-barchart--h')}
      style={horizontal ? style : ({ '--srx-barchart-h': height, ...style } as React.CSSProperties)}
      role="img"
      aria-label="Bar chart"
      {...rest}
    >
      {data.map((d, i) => {
        const pct = toPercent(d.value, max);
        const fill = d.color || 'var(--accent)';
        return (
          <div className="srx-barchart__cell" key={i}>
            <div className="srx-barchart__track">
              <div className="srx-barchart__bar" style={{ '--srx-bar-size': `${pct}%`, '--srx-bar-fill': fill } as React.CSSProperties}>
                {showValues ? <span className="srx-barchart__val">{d.value}</span> : null}
              </div>
            </div>
            <span className="srx-barchart__label">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
