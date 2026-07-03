import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../internal';

export interface LegendItem {
  /** Series name. */
  label: ReactNode;
  /** Swatch colour — any CSS colour or `var(--…)` expression. @default "var(--accent)" */
  color?: string;
  /** Swatch glyph. @default "dot" */
  shape?: 'dot' | 'line' | 'square';
}

export interface LegendProps extends HTMLAttributes<HTMLUListElement> {
  /** The series to key. */
  items: LegendItem[];
  /** @default "md" */
  size?: 'sm' | 'md';
}

/**
 * Legend — keys a chart's series to their colours. A wrap-friendly row of
 * swatch + label pairs; pair it under a LineChart/Donut/BarChart. The swatch
 * colour flows through the `--rdz-legend-color` custom property (data, never an
 * inline paint), so it re-themes with whatever token expression you pass.
 */
export function Legend({ items, size = 'md', className, ...rest }: LegendProps) {
  return (
    <ul className={cx('rdz-legend', className)} data-size={size} {...rest}>
      {items.map((item, i) => (
        <li key={i} className="rdz-legend__item">
          <span
            className="rdz-legend__swatch"
            data-shape={item.shape ?? 'dot'}
            style={{ '--rdz-legend-color': item.color ?? 'var(--accent)' } as CSSProperties}
            aria-hidden="true"
          />
          <span className="rdz-legend__label">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
