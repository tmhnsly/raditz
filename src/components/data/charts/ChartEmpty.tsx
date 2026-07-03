import type { ReactNode } from 'react';

export interface ChartEmptyProps {
  /** Notice content. @default "No data" */
  children?: ReactNode;
}

/**
 * ChartEmpty — the zero-data notice shared by every chart. A quiet centered
 * mono caption rendered inside the chart's (position: relative) root, so the
 * frame keeps its height while axes/marks stay off. visx charts pass it to
 * ChartFrame's `empty` slot; the pure-SVG/flex charts (BarChart, Donut,
 * Sparkline) render it directly inside their roots. Styled by
 * `.rdz-chart__empty` in charts.scss.
 */
export function ChartEmpty({ children }: ChartEmptyProps) {
  return <div className="rdz-chart__empty">{children ?? 'No data'}</div>;
}
