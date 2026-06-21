'use client';
import { useState } from 'react';
import { scaleLinear } from '@visx/scale';
import { Circle } from '@visx/shape';
import { GridRows, GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { ChartFrame } from '../charts/ChartFrame';
import { paddedDomain, TOOLTIP_FLIP_PCT } from '../../internal/scale';

export interface ScatterPoint {
  x: number;
  y: number;
  /** Relative bubble size (optional — equal dots if omitted). */
  size?: number;
  label?: string;
}

export interface ScatterChartProps {
  data: ScatterPoint[];
  height?: number;
  formatX?: (x: number) => string;
  formatY?: (y: number) => string;
  ariaLabel?: string;
}


/**
 * ScatterChart — a responsive scatter / bubble plot (visx). Pass `[{ x, y, size?,
 * label? }]`; `size` drives the bubble radius. Hovering a point shows a tooltip.
 */
export function ScatterChart({
  data,
  height = 260,
  formatX = (v) => String(v),
  formatY = (v) => String(v),
  ariaLabel = 'Scatter chart',
}: ScatterChartProps) {
  const [active, setActive] = useState<number | null>(null);
  if (data.length === 0) return <ChartFrame height={height} ariaLabel={ariaLabel}>{() => null}</ChartFrame>;
  const xDomain = paddedDomain(data.map((d) => d.x), 0.08);
  const yDomain = paddedDomain(data.map((d) => d.y), 0.08);
  const rMax = Math.max(1, ...data.map((d) => d.size ?? 1));

  const xFor = (iw: number) => scaleLinear({ domain: xDomain, range: [0, iw] });
  const yFor = (ih: number) => scaleLinear({ domain: yDomain, range: [ih, 0] });
  const rScale = scaleLinear({ domain: [0, rMax], range: [4, 15] });

  return (
    <ChartFrame
      height={height}
      ariaLabel={ariaLabel}
      margin={{ left: 40, right: 18, top: 14, bottom: 28 }}
      overlay={({ margin, innerWidth, innerHeight }) => {
        if (active == null || active >= data.length) return null;
        const x = xFor(innerWidth);
        const y = yFor(innerHeight);
        const d = data[active];
        const py = margin.top + (y(d.y) ?? 0);
        const below = py < TOOLTIP_FLIP_PCT; // not enough room above → flip the tip below the point
        return (
          <div
            className="rdz-chart__tip"
            data-side={below ? 'below' : 'above'}
            style={{ ['--rdz-tip-x' as string]: `${margin.left + (x(d.x) ?? 0)}px`, ['--rdz-tip-y' as string]: `${py}px` }}
          >
            {d.label ? <div className="rdz-chart__tip-title">{d.label}</div> : null}
            <div className="rdz-chart__tip-meta"><span className="rdz-chart__tip-value">{formatX(d.x)}, {formatY(d.y)}</span></div>
          </div>
        );
      }}
    >
      {({ innerWidth, innerHeight }) => {
        const x = xFor(innerWidth);
        const y = yFor(innerHeight);
        return (
          <>
            <GridRows scale={y} width={innerWidth} numTicks={4} className="rdz-chart__grid" />
            <GridColumns scale={x} height={innerHeight} numTicks={5} className="rdz-chart__grid" />
            <Group className="rdz-chart__axis">
              {y.ticks(4).map((t) => (
                <text key={`y${t}`} x={-8} y={y(t)} textAnchor="end" dominantBaseline="middle">{formatY(t)}</text>
              ))}
              {x.ticks(5).map((t) => (
                <text key={`x${t}`} x={x(t)} y={innerHeight + 18} textAnchor="middle">{formatX(t)}</text>
              ))}
            </Group>
            {data.map((d, i) => (
              <Circle
                key={i}
                cx={x(d.x) ?? 0}
                cy={y(d.y) ?? 0}
                r={d.size != null ? rScale(d.size) : 5}
                className="rdz-chart__bubble"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              />
            ))}
          </>
        );
      }}
    </ChartFrame>
  );
}
