import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Meter } from './Meter';
import * as stories from './Meter.stories';

const composed = composeStories(stories);

describe('Meter (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const meter = (): HTMLElement => screen.getByRole('meter');

describe('Meter', () => {
  it('exposes role=meter with aria-valuenow/min/max and a formatted valuetext', () => {
    render(<Meter value={64} label="Storage" showValue />);
    const el = meter();
    expect(el.getAttribute('aria-valuenow')).toBe('64');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
    expect(el.getAttribute('aria-valuetext')).toBe('64 / 100');
    expect(el.getAttribute('aria-label')).toBe('Storage');
  });

  it('clamps the value into [min, max] and sets the fill width', () => {
    const { container } = render(<Meter value={150} max={100} />);
    expect(meter().getAttribute('aria-valuenow')).toBe('100');
    const fill = container.querySelector('.rdz-meter__fill') as HTMLElement;
    expect(fill.style.getPropertyValue('--rdz-meter-pct')).toBe('100%');
  });

  it('computes the fill percent against a custom min/max', () => {
    const { container } = render(<Meter value={4} min={0} max={5} />);
    const fill = container.querySelector('.rdz-meter__fill') as HTMLElement;
    expect(fill.style.getPropertyValue('--rdz-meter-pct')).toBe('80%');
  });

  it('picks the fill tone from the first matching segment', () => {
    const segs = [{ to: 70, tone: 'success' as const }, { to: 90, tone: 'warning' as const }, { to: 100, tone: 'danger' as const }];
    const { container: a } = render(<Meter value={50} segments={segs} />);
    expect(a.querySelector('.rdz-meter__fill')?.getAttribute('data-color')).toBe('success');
    const { container: b } = render(<Meter value={95} segments={segs} />);
    expect(b.querySelector('.rdz-meter__fill')?.getAttribute('data-color')).toBe('danger');
  });

  it('supports a value formatter', () => {
    render(<Meter value={42} showValue={(v) => `${v}%`} />);
    expect(screen.getByText('42%')).toBeTruthy();
  });
});
