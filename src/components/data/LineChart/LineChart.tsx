import { useId, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { scaleLinear } from '@visx/scale';
import { LinePath, AreaClosed, Circle, Line } from '@visx/shape';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { curveMonotoneX } from '@visx/curve';
import { ChartFrame } from '../charts/ChartFrame';

export interface LinePoint {
  /** The plotted value. */
  y: number;
  /** Optional label (used by the default tooltip + markers). */
  label?: string;
}

export interface LineAnnotation {
  /** Index into `data`. */
  index: number;
  /** Short caption (e.g. "PEAK" / "STOP"). */
  label?: string;
}

export interface LineChartProps {
  data: LinePoint[];
  /** Chart height in px. @default 240 */
  height?: number;
  /** Fill the area under the line. @default false */
  area?: boolean;
  /** Value-mapped gradient stroke (accent → warning → danger). @default false */
  gradient?: boolean;
  /** Labelled point markers (e.g. a "PEAK" dot). */
  markers?: LineAnnotation[];
  /** Vertical dashed reference lines (e.g. a "STOP" annotation). */
  references?: LineAnnotation[];
  /** Y tick formatter. */
  formatY?: (y: number) => string;
  /** Custom hover tooltip content; omit for a simple value tooltip. */
  renderTooltip?: (point: LinePoint, index: number) => ReactNode;
  ariaLabel?: string;
}

/**
 * LineChart — a responsive line/area chart (visx) with an optional value-mapped
 * gradient stroke, labelled point markers, vertical reference-line annotations,
 * and an interactive crosshair + tooltip. The engagement/"episode" chart is just
 * this with a rich `renderTooltip` and a "STOP" reference (see the stories).
 */
export function LineChart({
  data,
  height = 240,
  area = false,
  gradient = false,
  markers = [],
  references = [],
  formatY = (y) => String(y),
  renderTooltip,
  ariaLabel = 'Line chart',
}: LineChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const uid = useId().replace(/:/g, ''); // unique gradient ids per instance
  const n = data.length;
  if (n === 0) return <ChartFrame height={height} ariaLabel={ariaLabel}>{() => null}</ChartFrame>;
  const ys = data.map((d) => d.y);
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const pad = (hi - lo) * 0.12 || 1;
  const yDomain: [number, number] = [lo - pad, hi + pad];

  const xFor = (iw: number) => scaleLinear({ domain: [0, Math.max(1, n - 1)], range: [0, iw] });
  const yFor = (ih: number) => scaleLinear({ domain: yDomain, range: [ih, 0] });

  return (
    <ChartFrame
      height={height}
      ariaLabel={ariaLabel}
      margin={{ left: 40, right: 18, top: 18, bottom: 16 }}
      defs={
        <>
          <linearGradient id={`${uid}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" className="srx-grad-line-0" /><stop offset="55%" className="srx-grad-line-1" /><stop offset="100%" className="srx-grad-line-2" />
          </linearGradient>
          <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="srx-grad-area-0" /><stop offset="100%" className="srx-grad-area-1" />
          </linearGradient>
        </>
      }
      overlay={({ margin, innerWidth, innerHeight }) => {
        if (active == null || active < 0 || active >= n) return null;
        const x = xFor(innerWidth);
        const y = yFor(innerHeight);
        const px = margin.left + (x(active) ?? 0);
        const py = margin.top + (y(data[active].y) ?? 0);
        const node = renderTooltip ? renderTooltip(data[active], active) : (
          <>
            {data[active].label ? <div className="srx-chart__tip-eyebrow">{data[active].label}</div> : null}
            <div className="srx-chart__tip-value">{formatY(data[active].y)}</div>
          </>
        );
        const below = py < 92; // not enough room above → flip the tip below the point
        return (
          <div className="srx-chart__tip" data-side={below ? 'below' : 'above'} style={{ ['--srx-tip-x' as string]: `${px}px`, ['--srx-tip-y' as string]: `${py}px` }}>
            {node}
          </div>
        );
      }}
    >
      {({ innerWidth, innerHeight }) => {
        const x = xFor(innerWidth);
        const y = yFor(innerHeight);
        const onMove = (e: MouseEvent<SVGRectElement>): void => {
          const rect = e.currentTarget.getBoundingClientRect();
          const lx = e.clientX - rect.left;
          const i = Math.max(0, Math.min(n - 1, Math.round(x.invert(lx))));
          setActive(i);
        };
        return (
          <>
            <GridRows scale={y} width={innerWidth} numTicks={4} className="srx-chart__grid" />
            <Group className="srx-chart__axis">
              {y.ticks(4).map((t) => (
                <text key={t} x={-8} y={y(t)} textAnchor="end" dominantBaseline="middle">{formatY(t)}</text>
              ))}
            </Group>

            {area ? (
              <AreaClosed data={data} x={(_d, i) => x(i) ?? 0} y={(d) => y(d.y) ?? 0} yScale={y} curve={curveMonotoneX} className="srx-chart__area" style={{ fill: `url(#${uid}-area)` }} />
            ) : null}
            <LinePath
              data={data}
              x={(_d, i) => x(i) ?? 0}
              y={(d) => y(d.y) ?? 0}
              curve={curveMonotoneX}
              className={gradient ? 'srx-chart__line' : 'srx-chart__line srx-chart__line--solid'}
              style={gradient ? { stroke: `url(#${uid}-line)` } : undefined}
            />

            {references.map((r) => (
              <Group key={`ref-${r.index}`} left={x(r.index) ?? 0}>
                <Line from={{ x: 0, y: 0 }} to={{ x: 0, y: innerHeight }} className="srx-chart__ref" />
                {r.label ? <text className="srx-chart__ref-label" x={6} y={12}>{r.label}</text> : null}
              </Group>
            ))}

            {markers.map((mk) => (
              <Group key={`mk-${mk.index}`} left={x(mk.index) ?? 0} top={y(data[mk.index]?.y ?? 0) ?? 0}>
                <Circle r={4} className="srx-chart__marker" />
                {mk.label ? <text className="srx-chart__marker-label" y={-12}>{mk.label}</text> : null}
              </Group>
            ))}

            {active != null && active >= 0 && active < n ? (
              <Group left={x(active) ?? 0}>
                <Line from={{ x: 0, y: 0 }} to={{ x: 0, y: innerHeight }} className="srx-chart__crosshair" />
                <Circle cy={y(data[active].y) ?? 0} r={5} className="srx-chart__active-dot" />
              </Group>
            ) : null}

            <rect
              className="srx-chart__hit"
              width={innerWidth}
              height={innerHeight}
              onMouseMove={onMove}
              onMouseLeave={() => setActive(null)}
            />
          </>
        );
      }}
    </ChartFrame>
  );
}
