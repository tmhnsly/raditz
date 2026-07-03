import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { DateRangePicker } from './DateRangePicker';
import * as stories from './DateRangePicker.stories';

const composed = composeStories(stories);

describe('DateRangePicker (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const trigger = (container: HTMLElement): HTMLButtonElement =>
  container.querySelector('.rdz-daterange__trigger') as HTMLButtonElement;
const dialogDay = (n: number): HTMLButtonElement => {
  const grid = document.querySelector('.rdz-calendar__grid') as HTMLElement;
  return within(grid).getByText(String(n), { selector: '.rdz-calendar__day' }) as HTMLButtonElement;
};

describe('DateRangePicker', () => {
  it('shows the placeholder when empty and a formatted span when set', () => {
    const { container, rerender } = render(<DateRangePicker value={{}} placeholder="Pick dates" />);
    expect(trigger(container).textContent).toContain('Pick dates');
    rerender(<DateRangePicker value={{ from: '2026-07-06', to: '2026-07-12' }} />);
    expect(trigger(container).textContent).toContain('Jul 6');
    expect(trigger(container).textContent).toContain('Jul 12, 2026');
  });

  it('opens the calendar dialog on trigger click', () => {
    const { container } = render(<DateRangePicker defaultValue={{ from: '2026-07-06' }} />);
    fireEvent.click(trigger(container));
    expect(screen.getByRole('dialog', { name: 'Choose date range' })).toBeTruthy();
  });

  it('picking a start then an end fires onValueChange and closes the popover', () => {
    const onValueChange = vi.fn();
    const { container } = render(<DateRangePicker defaultValue={{}} onValueChange={onValueChange} />);
    fireEvent.click(trigger(container));
    fireEvent.click(dialogDay(8));
    expect(onValueChange).toHaveBeenLastCalledWith({ from: expect.stringMatching(/-08$/), to: undefined });
    // still open after the first pick
    expect(document.querySelector('.rdz-calendar__grid')).toBeTruthy();
    fireEvent.click(dialogDay(14));
    const calls = onValueChange.mock.calls;
    const last = calls[calls.length - 1][0];
    expect(last.from).toMatch(/-08$/);
    expect(last.to).toMatch(/-14$/);
    // completing the range closes the popover
    expect(document.querySelector('.rdz-calendar__grid')).toBeNull();
  });
});
