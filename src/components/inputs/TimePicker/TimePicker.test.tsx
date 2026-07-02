import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './TimePicker.stories';
import { TimePicker } from './TimePicker';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('TimePicker', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  // The full freeze-boundary behaviour (move + preventDefault, column hops,
  // clamping) is asserted once at the hook — see internal/useGridFocus.test.tsx.
  // This is a smoke check that the time columns are wired to it.
  it('wires the columns to the grid-focus rover (open focuses the selection; arrows are captured)', () => {
    const { container } = render(<TimePicker defaultValue="10:30" hour12={false} />);
    fireEvent.click(container.querySelector('.rdz-timepicker__trigger') as HTMLButtonElement);
    const sel = document.querySelector('.rdz-timemenu__opt.is-selected') as HTMLButtonElement;
    expect(sel).toBeTruthy();
    expect(document.activeElement).toBe(sel); // focused on open
    const notPrevented = fireEvent.keyDown(sel, { key: 'ArrowDown' });
    expect(notPrevented).toBe(false); // preventDefault ran — no page scroll
    expect(document.activeElement).not.toBe(sel); // focus moved within the column
  });
});
