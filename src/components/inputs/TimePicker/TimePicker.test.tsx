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

  it('roves the columns with arrows and preventDefaults them (so they never scroll the page)', () => {
    const { container } = render(<TimePicker defaultValue="10:30" hour12={false} />);
    fireEvent.click(container.querySelector('.rdz-timepicker__trigger') as HTMLButtonElement);
    const opts = Array.from(document.querySelectorAll<HTMLButtonElement>('.rdz-timemenu__opt'));
    expect(opts.length).toBeGreaterThan(1);
    opts[0].focus();
    // fireEvent returns false when the event was cancelled — i.e. preventDefault
    // ran, so the arrow moves the selection instead of scrolling the page.
    const notPrevented = fireEvent.keyDown(opts[0], { key: 'ArrowDown' });
    expect(notPrevented).toBe(false);
    expect(document.activeElement).toBe(opts[1]);
  });
});
