import { Group } from '@visx/group';

/** The structural slice of a d3/visx linear scale that axis rendering needs. */
export interface LinearTickScale {
  (value: number): number | undefined;
  ticks(count?: number): number[];
}

export interface ChartAxisProps {
  /** Y scale in the inner (margin-offset) coordinate space. */
  y: LinearTickScale;
  formatY: (value: number) => string;
  /** @default 4 */
  yTickCount?: number;
  /** X scale — pass together with `formatX` + `innerHeight` for bottom labels (ScatterChart). */
  x?: LinearTickScale;
  formatX?: (value: number) => string;
  /** @default 5 */
  xTickCount?: number;
  /** Inner plot height — x labels render 18px below it. */
  innerHeight?: number;
}

/**
 * ChartAxis — the tick-label group shared by LineChart and ScatterChart.
 * Always renders right-aligned y labels in the left margin; optionally renders
 * bottom x labels when `x`/`formatX`/`innerHeight` are given. Styling comes
 * from `.rdz-chart__axis` in charts.scss.
 */
export function ChartAxis({ y, formatY, yTickCount = 4, x, formatX, xTickCount = 5, innerHeight }: ChartAxisProps) {
  return (
    <Group className="rdz-chart__axis">
      {y.ticks(yTickCount).map((t) => (
        <text key={`y${t}`} x={-8} y={y(t)} textAnchor="end" dominantBaseline="middle">{formatY(t)}</text>
      ))}
      {x && formatX && innerHeight != null
        ? x.ticks(xTickCount).map((t) => (
            <text key={`x${t}`} x={x(t)} y={innerHeight + 18} textAnchor="middle">{formatX(t)}</text>
          ))
        : null}
    </Group>
  );
}
