import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Calendar } from './Calendar';
import * as stories from './Calendar.stories';

const composed = composeStories(stories);

describe('Calendar (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

// A day button by its number, scoped to the day grid (month/year cells excluded).
const day = (container: HTMLElement, n: number): HTMLButtonElement => {
  const grid = container.querySelector('.rdz-calendar__grid') as HTMLElement;
  return within(grid).getByText(String(n), { selector: '.rdz-calendar__day' }) as HTMLButtonElement;
};

describe('Calendar (single)', () => {
  it('clicking a day fires onValueChange with its ISO date', () => {
    const onValueChange = vi.fn();
    const { container } = render(<Calendar defaultValue="2026-07-10" onValueChange={onValueChange} />);
    fireEvent.click(day(container, 15));
    expect(onValueChange).toHaveBeenCalledWith('2026-07-15');
  });

  it('marks the selected day and disables out-of-range days', () => {
    const { container } = render(<Calendar value="2026-07-10" min="2026-07-05" max="2026-07-20" />);
    expect(day(container, 10).classList.contains('is-selected')).toBe(true);
    expect(day(container, 3).disabled).toBe(true);
    expect(day(container, 25).disabled).toBe(true);
    expect(day(container, 10).disabled).toBe(false);
  });
});

describe('Calendar (range)', () => {
  it('first click sets `from`, second sets `to`', () => {
    // An empty range opens on today's month, so pin the clock to keep the test date-independent.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-01T12:00:00'));
    try {
      const onRangeChange = vi.fn();
      const { container } = render(<Calendar range={{}} onRangeChange={onRangeChange} />);
      fireEvent.click(day(container, 8));
      expect(onRangeChange).toHaveBeenLastCalledWith({ from: '2026-07-08', to: undefined });
    } finally {
      vi.useRealTimers();
    }
  });

  it('a second click before the first swaps the endpoints so from ≤ to', () => {
    const onRangeChange = vi.fn();
    // start with `from` already set to the 15th, `to` empty
    const { container } = render(<Calendar range={{ from: '2026-07-15' }} onRangeChange={onRangeChange} />);
    fireEvent.click(day(container, 9)); // earlier than from → swap
    expect(onRangeChange).toHaveBeenLastCalledWith({ from: '2026-07-09', to: '2026-07-15' });
  });

  it('a click after `from` extends the range forward', () => {
    const onRangeChange = vi.fn();
    const { container } = render(<Calendar range={{ from: '2026-07-09' }} onRangeChange={onRangeChange} />);
    fireEvent.click(day(container, 15));
    expect(onRangeChange).toHaveBeenLastCalledWith({ from: '2026-07-09', to: '2026-07-15' });
  });

  it('a complete range restarts on the next click', () => {
    const onRangeChange = vi.fn();
    const { container } = render(<Calendar range={{ from: '2026-07-09', to: '2026-07-15' }} onRangeChange={onRangeChange} />);
    fireEvent.click(day(container, 20));
    expect(onRangeChange).toHaveBeenLastCalledWith({ from: '2026-07-20', to: undefined });
  });

  it('paints endpoint and in-range day classes for a set span', () => {
    const { container } = render(<Calendar range={{ from: '2026-07-09', to: '2026-07-12' }} />);
    expect(day(container, 9).classList.contains('is-range-start')).toBe(true);
    expect(day(container, 12).classList.contains('is-range-end')).toBe(true);
    expect(day(container, 10).classList.contains('is-in-range')).toBe(true);
    expect(day(container, 11).classList.contains('is-in-range')).toBe(true);
    expect(day(container, 8).classList.contains('is-in-range')).toBe(false);
  });
});
