import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './TextReveal.stories';
import { TextReveal } from './TextReveal';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('TextReveal', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('keeps the full text readable for screen readers and splits the visible words', () => {
    const { container } = render(<TextReveal text="Hello there world" />);
    // full string present once for AT
    expect(container.querySelector('.rdz-sr-only')?.textContent).toBe('Hello there world');
    // three visible word units, hidden from AT
    const units = container.querySelectorAll('.rdz-split__unit');
    expect(units.length).toBe(3);
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});
