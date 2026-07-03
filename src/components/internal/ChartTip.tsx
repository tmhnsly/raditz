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

export type ChartTipAlign = 'start' | 'center' | 'end';

/** Half the tip's max footprint (max-width 16rem) — inside this band of an edge
 *  a centered tip would hang past the chart and get clipped by a card's
 *  radius clip / the preview frame. */
const TIP_EDGE_PX = 128;

/**
 * Horizontal anchoring: centered by default; near the left/right chart edge the
 * tip grows inward from the anchor instead of hanging (squashed/invisible)
 * outside the clipped container.
 */
export function chartTipAlign(x: number, width: number, edge = TIP_EDGE_PX): ChartTipAlign {
  if (width < 2 * edge) return 'center'; // tiny chart — nothing sensible to hug
  if (x < edge) return 'start';
  if (width - x < edge) return 'end';
  return 'center';
}

export interface ChartTipProps {
  /** Anchor x, px from the chart's outer left edge (`margin.left + xScale(point)`). */
  x: number;
  /** Anchor y, px from the chart's outer top edge (`margin.top + yScale(point)`). */
  y: number;
  /** Chart outer width, px — lets the tip hug the chart near the edges. */
  width?: number;
  children: ReactNode;
}

/**
 * ChartTip — the HTML tooltip overlay shared by LineChart and ScatterChart.
 * Renders into ChartFrame's `overlay` layer, positioned entirely via the
 * `--rdz-tip-x` / `--rdz-tip-y` custom properties (charts.scss translates
 * around them) and flipped via `data-side` when the point sits too close to
 * the chart top. Callers supply the tip content (value/label/meta rows).
 */
export function ChartTip({ x, y, width, children }: ChartTipProps) {
  return (
    <div
      className="rdz-chart__tip"
      data-side={chartTipSide(y)}
      data-align={width !== undefined ? chartTipAlign(x, width) : 'center'}
      style={{ '--rdz-tip-x': `${x}px`, '--rdz-tip-y': `${y}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
