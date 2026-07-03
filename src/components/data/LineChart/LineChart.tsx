'use client';
import { useId, useState } from 'react';
import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { scaleLinear } from '@visx/scale';
import { LinePath, AreaClosed, Circle, Line } from '@visx/shape';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { curveMonotoneX } from '@visx/curve';
import { ChartFrame } from '../charts/ChartFrame';
import { ChartEmpty } from '../charts/ChartEmpty';
import { paddedDomain, ChartTip, ChartAxis } from '../../internal';

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

export interface LineSeries {
  /** Series name (shown in the multi-series tooltip; pair with a `Legend`). */
  name?: string;
  data: LinePoint[];
  /** Stroke colour (CSS colour or `var(--…)`); defaults to a rotating palette. */
  color?: string;
}

/** Default series palette when a `LineSeries` gives no `color` (cycled by index). */
const SERIES_COLORS = ['var(--accent)', 'var(--warning)', 'var(--danger)', 'var(--info, var(--accent))', 'var(--success, var(--accent))'];
const seriesColor = (s: LineSeries, i: number): string => s.color ?? SERIES_COLORS[i % SERIES_COLORS.length];

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Single-series points. Provide this OR `series`. */
  data?: LinePoint[];
  /** Multiple named series (comparison mode). Takes precedence over `data`;
   *  markers/references/gradient/renderTooltip are single-series only. */
  series?: LineSeries[];
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
  /** Zero-data notice text. @default "No data" */
  emptyMessage?: ReactNode;
}

/**
 * LineChart — a responsive line/area chart (visx) with an optional value-mapped
 * gradient stroke, labelled point markers, vertical reference-line annotations,
 * and an interactive crosshair + tooltip. The engagement/"episode" chart is just
 * this with a rich `renderTooltip` and a "STOP" reference (see the stories).
 */
export function LineChart({
  data,
  series,
  height = 240,
  area = false,
  gradient = false,
  markers = [],
  references = [],
  formatY = (y) => String(y),
  renderTooltip,
  emptyMessage,
  ...rest
}: LineChartProps) {
  // Multi-series is a distinct, simpler mode (comparison lines); the rich
  // single-series path below keeps gradient/markers/references/renderTooltip.
  if (series && series.length) {
    return <LineMulti series={series} height={height} formatY={formatY} emptyMessage={emptyMessage} {...rest} />;
  }
  return <LineSingle data={data ?? []} height={height} area={area} gradient={gradient} markers={markers} references={references} formatY={formatY} renderTooltip={renderTooltip} emptyMessage={emptyMessage} {...rest} />;
}

type SingleProps = Omit<LineChartProps, 'series'> & { data: LinePoint[] };

function LineSingle({
  data,
  height = 240,
  area = false,
  gradient = false,
  markers = [],
  references = [],
  formatY = (y) => String(y),
  renderTooltip,
  emptyMessage,
  ...rest
}: SingleProps) {
  const [active, setActive] = useState<number | null>(null);
  const uid = useId().replace(/:/g, ''); // unique gradient ids per instance
  const n = data.length;
  // Default accessible name; a consumer `aria-label` in `rest` overrides it.
  if (n === 0) return <ChartFrame height={height} aria-label="Line chart" empty={<ChartEmpty>{emptyMessage}</ChartEmpty>} {...rest}>{() => null}</ChartFrame>;
  const ys = data.map((d) => d.y);
  const yDomain = paddedDomain(ys, 0.12);

  const xFor = (iw: number) => scaleLinear({ domain: [0, Math.max(1, n - 1)], range: [0, iw] });
  const yFor = (ih: number) => scaleLinear({ domain: yDomain, range: [ih, 0] });

  return (
    <ChartFrame
      height={height}
      aria-label="Line chart"
      margin={{ left: 40, right: 18, top: 18, bottom: 16 }}
      {...rest}
      defs={
        <>
          <linearGradient id={`${uid}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" className="rdz-grad-line-0" /><stop offset="55%" className="rdz-grad-line-1" /><stop offset="100%" className="rdz-grad-line-2" />
          </linearGradient>
          <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="rdz-grad-area-0" /><stop offset="100%" className="rdz-grad-area-1" />
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
            {data[active].label ? <div className="rdz-chart__tip-eyebrow">{data[active].label}</div> : null}
            <div className="rdz-chart__tip-value">{formatY(data[active].y)}</div>
          </>
        );
        return <ChartTip x={px} y={py} width={margin.left + innerWidth + margin.right}>{node}</ChartTip>;
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
            <GridRows scale={y} width={innerWidth} numTicks={4} className="rdz-chart__grid" />
            <ChartAxis y={y} formatY={formatY} />

            {/* The `fill`/`stroke: url(#id)` inline styles below are sanctioned:
                they reference per-instance SVG gradient defs by generated id —
                a paint-server URL can't be expressed via a class or custom
                property (the id is unique per mount). */}
            {area ? (
              <AreaClosed data={data} x={(_d, i) => x(i) ?? 0} y={(d) => y(d.y) ?? 0} yScale={y} curve={curveMonotoneX} className="rdz-chart__area" style={{ fill: `url(#${uid}-area)` }} />
            ) : null}
            <LinePath
              data={data}
              x={(_d, i) => x(i) ?? 0}
              y={(d) => y(d.y) ?? 0}
              curve={curveMonotoneX}
              className={gradient ? 'rdz-chart__line' : 'rdz-chart__line rdz-chart__line--solid'}
              style={gradient ? { stroke: `url(#${uid}-line)` } : undefined}
            />

            {references.map((r) => (
              <Group key={`ref-${r.index}`} left={x(r.index) ?? 0}>
                <Line from={{ x: 0, y: 0 }} to={{ x: 0, y: innerHeight }} className="rdz-chart__ref" />
                {r.label ? <text className="rdz-chart__ref-label" x={6} y={12}>{r.label}</text> : null}
              </Group>
            ))}

            {markers.map((mk) => (
              <Group key={`mk-${mk.index}`} left={x(mk.index) ?? 0} top={y(data[mk.index]?.y ?? 0) ?? 0}>
                <Circle r={4} className="rdz-chart__marker" />
                {mk.label ? <text className="rdz-chart__marker-label" y={-12}>{mk.label}</text> : null}
              </Group>
            ))}

            {active != null && active >= 0 && active < n ? (
              <Group left={x(active) ?? 0}>
                <Line from={{ x: 0, y: 0 }} to={{ x: 0, y: innerHeight }} className="rdz-chart__crosshair" />
                <Circle cy={y(data[active].y) ?? 0} r={5} className="rdz-chart__active-dot" />
              </Group>
            ) : null}

            <rect
              className="rdz-chart__hit"
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

/** Multi-series comparison lines sharing one y-scale + crosshair; the tooltip
 *  lists every series' value at the hovered index (pair with a `Legend`). */
function LineMulti({
  series,
  height = 240,
  formatY = (y) => String(y),
  emptyMessage,
  ...rest
}: { series: LineSeries[]; height?: number; formatY?: (y: number) => string; emptyMessage?: ReactNode } & Omit<HTMLAttributes<HTMLDivElement>, 'children'>) {
  const [active, setActive] = useState<number | null>(null);
  const maxLen = Math.max(0, ...series.map((s) => s.data.length));
  if (maxLen === 0) return <ChartFrame height={height} aria-label="Line chart" empty={<ChartEmpty>{emptyMessage}</ChartEmpty>} {...rest}>{() => null}</ChartFrame>;
  const allYs = series.flatMap((s) => s.data.map((d) => d.y));
  const yDomain = paddedDomain(allYs, 0.12);
  const xFor = (iw: number) => scaleLinear({ domain: [0, Math.max(1, maxLen - 1)], range: [0, iw] });
  const yFor = (ih: number) => scaleLinear({ domain: yDomain, range: [ih, 0] });

  return (
    <ChartFrame
      height={height}
      aria-label="Line chart"
      margin={{ left: 40, right: 18, top: 18, bottom: 16 }}
      {...rest}
      overlay={({ margin, innerWidth, innerHeight }) => {
        if (active == null) return null;
        const x = xFor(innerWidth);
        const y = yFor(innerHeight);
        const present = series.map((s, i) => ({ s, i, pt: s.data[active] })).filter((v) => v.pt);
        if (!present.length) return null;
        const px = margin.left + (x(active) ?? 0);
        const py = margin.top + Math.min(...present.map((v) => y(v.pt!.y) ?? 0));
        const header = present.map((v) => v.pt!.label).find(Boolean);
        return (
          <ChartTip x={px} y={py} width={margin.left + innerWidth + margin.right}>
            {header ? <div className="rdz-chart__tip-eyebrow">{header}</div> : null}
            {present.map((v) => (
              <div className="rdz-chart__tip-row" key={v.i}>
                <span className="rdz-chart__tip-swatch" style={{ '--rdz-line-color': seriesColor(v.s, v.i) } as CSSProperties} />
                {v.s.name ? <span className="rdz-chart__tip-name">{v.s.name}</span> : null}
                <span className="rdz-chart__tip-value">{formatY(v.pt!.y)}</span>
              </div>
            ))}
          </ChartTip>
        );
      }}
    >
      {({ innerWidth, innerHeight }) => {
        const x = xFor(innerWidth);
        const y = yFor(innerHeight);
        const onMove = (e: MouseEvent<SVGRectElement>): void => {
          const rect = e.currentTarget.getBoundingClientRect();
          const i = Math.max(0, Math.min(maxLen - 1, Math.round(x.invert(e.clientX - rect.left))));
          setActive(i);
        };
        return (
          <>
            <GridRows scale={y} width={innerWidth} numTicks={4} className="rdz-chart__grid" />
            <ChartAxis y={y} formatY={formatY} />

            {series.map((s, i) => (
              <LinePath
                key={i}
                data={s.data}
                x={(_d, j) => x(j) ?? 0}
                y={(d) => y(d.y) ?? 0}
                curve={curveMonotoneX}
                className="rdz-chart__line rdz-chart__line--series"
                style={{ '--rdz-line-color': seriesColor(s, i) } as CSSProperties}
              />
            ))}

            {active != null ? (
              <Group left={x(active) ?? 0}>
                <Line from={{ x: 0, y: 0 }} to={{ x: 0, y: innerHeight }} className="rdz-chart__crosshair" />
                {series.map((s, i) => s.data[active] ? (
                  <Circle key={i} cy={y(s.data[active].y) ?? 0} r={4} className="rdz-chart__active-dot rdz-chart__active-dot--series" style={{ '--rdz-line-color': seriesColor(s, i) } as CSSProperties} />
                ) : null)}
              </Group>
            ) : null}

            <rect className="rdz-chart__hit" width={innerWidth} height={innerHeight} onMouseMove={onMove} onMouseLeave={() => setActive(null)} />
          </>
        );
      }}
    </ChartFrame>
  );
}
