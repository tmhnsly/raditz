'use client';
import type { CSSProperties, ReactNode } from 'react';
import { TOOLTIP_FLIP_PCT } from './scale';

export type ChartTipSide = 'above' | 'below';

/**
 * Which side of the data point the tooltip renders on. Points too close to the
 * chart top (y < {@link TOOLTIP_FLIP_PCT}px) don't have room for a tip above
 * them, so it flips below.
 */
export function chartTipSide(y: number): ChartTipSide {
  return y < TOOLTIP_FLIP_PCT ? 'below' : 'above';
}

export interface ChartTipProps {
  /** Anchor x, px from the chart's outer left edge (`margin.left + xScale(point)`). */
  x: number;
  /** Anchor y, px from the chart's outer top edge (`margin.top + yScale(point)`). */
  y: number;
  children: ReactNode;
}

/**
 * ChartTip — the HTML tooltip overlay shared by LineChart and ScatterChart.
 * Renders into ChartFrame's `overlay` layer, positioned entirely via the
 * `--rdz-tip-x` / `--rdz-tip-y` custom properties (charts.scss translates
 * around them) and flipped via `data-side` when the point sits too close to
 * the chart top. Callers supply the tip content (value/label/meta rows).
 */
export function ChartTip({ x, y, children }: ChartTipProps) {
  return (
    <div
      className="rdz-chart__tip"
      data-side={chartTipSide(y)}
      style={{ '--rdz-tip-x': `${x}px`, '--rdz-tip-y': `${y}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
