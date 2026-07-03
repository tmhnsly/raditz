import * as React from 'react';
import { cx, minMax, toPercent } from '../../internal';
import { ChartEmpty } from '../charts/ChartEmpty';

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
  /** Zero-data notice text. @default "No data" */
  emptyMessage?: React.ReactNode;
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
  emptyMessage,
  className,
  style,
  ...rest
}: BarChartProps): React.ReactElement {
  const max = Math.max(minMax(data.map((d) => d.value)).max, 1);
  if (data.length === 0) {
    return (
      <div
        className={cx('rdz-barchart', horizontal && 'rdz-barchart--h', 'rdz-barchart--empty', className)}
        style={horizontal ? style : ({ '--rdz-barchart-h': height, ...style } as React.CSSProperties)}
        role="img"
        aria-label="Bar chart"
        {...rest}
      >
        <ChartEmpty>{emptyMessage}</ChartEmpty>
      </div>
    );
  }
  return (
    <div
      className={cx('rdz-barchart', horizontal && 'rdz-barchart--h', className)}
      style={horizontal ? style : ({ '--rdz-barchart-h': height, ...style } as React.CSSProperties)}
      role="img"
      aria-label="Bar chart"
      {...rest}
    >
      {data.map((d, i) => {
        const pct = toPercent(d.value, max);
        const fill = d.color || 'var(--accent)';
        return (
          <div className="rdz-barchart__cell" key={i}>
            <div className="rdz-barchart__track">
              <div className="rdz-barchart__bar" style={{ '--rdz-bar-size': `${pct}%`, '--rdz-bar-fill': fill } as React.CSSProperties}>
                {showValues ? <span className="rdz-barchart__val">{d.value}</span> : null}
              </div>
            </div>
            <span className="rdz-barchart__label">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
