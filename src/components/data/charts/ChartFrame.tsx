import type { CSSProperties, ReactNode } from 'react';
import { ParentSize } from '@visx/responsive';
import { Group } from '@visx/group';
import { cx } from '../../internal';

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartDims {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: ChartMargin;
}

export interface ChartFrameProps {
  /** Outer height in px. @default 240 */
  height?: number;
  /** Inner padding for axes/labels. */
  margin?: Partial<ChartMargin>;
  /** Accessible label — the SVG is `role="img"`. */
  ariaLabel: string;
  className?: string;
  /** `<defs>` (gradients/clips) rendered once, outside the margin group. */
  defs?: ReactNode;
  /** Chart content, drawn in the inner coordinate space (origin inside the margins). */
  children: (dims: ChartDims) => ReactNode;
  /** Optional HTML layer over the chart (tooltips), positioned in the outer box. */
  overlay?: (dims: ChartDims) => ReactNode;
}

const DEFAULT_MARGIN: ChartMargin = { top: 12, right: 16, bottom: 28, left: 38 };

/**
 * The responsive shell shared by every chart. Measures its box (`@visx/responsive`),
 * renders an `<svg>` with a margin-offset `<Group>` for the plot area, and exposes
 * an optional HTML `overlay` layer for tooltips. Colours come from CSS tokens, so
 * charts re-theme with the system.
 */
export function ChartFrame({ height = 240, margin, ariaLabel, className, defs, children, overlay }: ChartFrameProps) {
  const m: ChartMargin = { ...DEFAULT_MARGIN, ...margin };
  return (
    <div className={cx('srx-chart', className)} style={{ height } as CSSProperties}>
      <ParentSize>
        {({ width, height: h }) => {
          if (width < 10 || h < 10) return null;
          const dims: ChartDims = {
            width,
            height: h,
            innerWidth: Math.max(0, width - m.left - m.right),
            innerHeight: Math.max(0, h - m.top - m.bottom),
            margin: m,
          };
          return (
            <>
              <svg width={width} height={h} role="img" aria-label={ariaLabel} className="srx-chart__svg">
                {defs}
                <Group left={m.left} top={m.top}>
                  {children(dims)}
                </Group>
              </svg>
              {overlay ? overlay(dims) : null}
            </>
          );
        }}
      </ParentSize>
    </div>
  );
}
