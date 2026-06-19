// Pure scale/geometry helpers shared by the charts (BarChart, Donut, Sparkline)
// and Progress. Keeping the math here — out of the JSX closures — makes it
// unit-testable and gives every chart one source of truth for normalization.

export function minMax(nums: number[]): { min: number; max: number } {
  if (!nums.length) return { min: 0, max: 0 };
  let min = nums[0];
  let max = nums[0];
  for (const n of nums) { if (n < min) min = n; if (n > max) max = n; }
  return { min, max };
}

/** Map `v` into 0..1 across [min,max]; a zero span yields 0 (no divide-by-zero). */
export function normalize(v: number, min: number, max: number): number {
  const span = max - min;
  return span === 0 ? 0 : (v - min) / span;
}

/** `v` as a 0..100 percentage of `max`, clamped. Guards `max <= 0`. */
export function toPercent(v: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, (v / max) * 100));
}

export interface SparklineGeom { line: string; area: string; }

/** Build the line + filled-area SVG paths for a sparkline series. */
export function sparklinePath(data: number[], opts: { w?: number; h?: number; pad?: number } = {}): SparklineGeom {
  const { w = 100, h = 32, pad = 2 } = opts;
  const n = data.length;
  if (n === 0) return { line: '', area: '' };
  const { min, max } = minMax(data);
  const span = max - min || 1;
  const x = (i: number): number => (n === 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (val: number): number => h - pad - ((val - min) / span) * (h - pad * 2);
  const line = data.map((val, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)} ${y(val).toFixed(2)}`).join(' ');
  const area = `${line} L${w.toFixed(2)} ${h.toFixed(2)} L0 ${h.toFixed(2)} Z`;
  return { line, area };
}

export interface DonutDash { dash: number; gap: number; offset: number; }

/** Proportional stroke-dash segments around a ring of given circumference. */
export function donutDashes(values: number[], circumference: number): DonutDash[] {
  const total = values.reduce((s, v) => s + v, 0) || 1;
  let offset = 0;
  return values.map((v) => {
    const len = (v / total) * circumference;
    const seg = { dash: len, gap: circumference - len, offset: -offset };
    offset += len;
    return seg;
  });
}
