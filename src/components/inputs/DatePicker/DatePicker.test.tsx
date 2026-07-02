import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './DatePicker.stories';
import { DatePicker } from './DatePicker';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('DatePicker', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  // The full freeze-boundary behaviour (move + preventDefault, row jumps,
  // clamping) is asserted once at the hook — see internal/useGridFocus.test.tsx.
  // This is a smoke check that the day grid is wired to it.
  it('wires the day grid to the grid-focus rover (open focuses the selected day; arrows are captured)', () => {
    const { container } = render(<DatePicker defaultValue="2026-06-15" />);
    fireEvent.click(container.querySelector('.rdz-datepicker__trigger') as HTMLButtonElement);
    const sel = document.querySelector('.rdz-calendar__day.is-selected') as HTMLButtonElement;
    expect(sel).toBeTruthy();
    expect(document.activeElement).toBe(sel); // focused on open
    const notPrevented = fireEvent.keyDown(sel, { key: 'ArrowRight' });
    expect(notPrevented).toBe(false); // preventDefault ran — no page scroll
  });
});
