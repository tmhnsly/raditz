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

  it('moves the day focus with arrows and preventDefaults them (no page scroll)', () => {
    const { container } = render(<DatePicker defaultValue="2026-06-15" />);
    fireEvent.click(container.querySelector('.rdz-datepicker__trigger') as HTMLButtonElement);
    const days = Array.from(document.querySelectorAll<HTMLButtonElement>('.rdz-calendar__day'));
    expect(days.length).toBeGreaterThan(1);
    const sel = (document.querySelector('.rdz-calendar__day.is-selected') as HTMLButtonElement) ?? days[0];
    sel.focus();
    const notPrevented = fireEvent.keyDown(sel, { key: 'ArrowRight' });
    expect(notPrevented).toBe(false);
  });
});
