import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChartTip, chartTipSide, chartTipAlign } from './ChartTip';
import { TOOLTIP_FLIP_PCT } from './scale';
import { ChartAxis } from './ChartAxis';
import type { LinearTickScale } from './ChartAxis';

const tipOf = (container: HTMLElement): HTMLElement => container.querySelector('.rdz-chart__tip') as HTMLElement;

describe('chartTipSide', () => {
  it('flips below when the point is above the flip threshold, above otherwise', () => {
    expect(chartTipSide(0)).toBe('below');
    expect(chartTipSide(TOOLTIP_FLIP_PCT - 1)).toBe('below');
    expect(chartTipSide(TOOLTIP_FLIP_PCT)).toBe('above');
    expect(chartTipSide(TOOLTIP_FLIP_PCT + 100)).toBe('above');
  });
});

describe('chartTipAlign', () => {
  it('hugs the near edge so the tip grows inward instead of hanging outside', () => {
    expect(chartTipAlign(10, 800)).toBe('start');
    expect(chartTipAlign(790, 800)).toBe('end');
    expect(chartTipAlign(400, 800)).toBe('center');
  });
  it('stays centered on a chart too small to hug', () => {
    expect(chartTipAlign(10, 200)).toBe('center');
  });
});

describe('ChartTip', () => {
  it('reflects edge-hugging in data-align when width is known (center otherwise)', () => {
    const { container: end } = render(<ChartTip x={790} y={200} width={800}>a</ChartTip>);
    expect(tipOf(end).getAttribute('data-align')).toBe('end');
    const { container: bare } = render(<ChartTip x={790} y={200}>a</ChartTip>);
    expect(tipOf(bare).getAttribute('data-align')).toBe('center');
  });

  it('positions via the --rdz-tip-x/--rdz-tip-y custom properties', () => {
    const { container } = render(<ChartTip x={123} y={200}>hi</ChartTip>);
    const tip = tipOf(container);
    expect(tip.style.getPropertyValue('--rdz-tip-x')).toBe('123px');
    expect(tip.style.getPropertyValue('--rdz-tip-y')).toBe('200px');
    expect(tip.textContent).toBe('hi');
  });

  it('reflects the flip decision in data-side', () => {
    const { container: near } = render(<ChartTip x={0} y={10}>a</ChartTip>);
    expect(tipOf(near).getAttribute('data-side')).toBe('below');
    const { container: far } = render(<ChartTip x={0} y={180}>b</ChartTip>);
    expect(tipOf(far).getAttribute('data-side')).toBe('above');
  });
});

// Minimal stand-in for a d3/visx linear scale.
const fakeScale = (ticks: number[], map: (v: number) => number): LinearTickScale =>
  Object.assign((v: number) => map(v), { ticks: () => ticks });

describe('ChartAxis', () => {
  it('renders right-aligned y tick labels in the axis group', () => {
    const y = fakeScale([0, 5, 10], (v) => 100 - v);
    const { container } = render(<svg><ChartAxis y={y} formatY={(v) => `£${v}`} /></svg>);
    const texts = Array.from(container.querySelectorAll('.rdz-chart__axis text'));
    expect(texts.map((t) => t.textContent)).toEqual(['£0', '£5', '£10']);
    expect(texts.every((t) => t.getAttribute('x') === '-8' && t.getAttribute('text-anchor') === 'end')).toBe(true);
    expect(texts[1].getAttribute('y')).toBe('95');
  });

  it('adds bottom x tick labels when an x scale + innerHeight are given', () => {
    const y = fakeScale([0], () => 0);
    const x = fakeScale([1, 2], (v) => v * 10);
    const { container } = render(
      <svg><ChartAxis y={y} formatY={String} x={x} formatX={(v) => `t${v}`} innerHeight={100} /></svg>,
    );
    const texts = Array.from(container.querySelectorAll('.rdz-chart__axis text'));
    const xLabels = texts.filter((t) => t.getAttribute('text-anchor') === 'middle');
    expect(xLabels.map((t) => t.textContent)).toEqual(['t1', 't2']);
    expect(xLabels.every((t) => t.getAttribute('y') === '118')).toBe(true);
  });
});
