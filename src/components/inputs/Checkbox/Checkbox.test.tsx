import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Checkbox.stories';
import { Checkbox } from './Checkbox';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Checkbox', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('sets the DOM indeterminate property from the indeterminate prop', () => {
    const { container, rerender } = render(<Checkbox aria-label="Select some" indeterminate readOnly checked={false} />);
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input.checked).toBe(false);
    // The property tracks the prop across re-renders (no stale tri-state).
    rerender(<Checkbox aria-label="Select some" readOnly checked />);
    expect(input.indeterminate).toBe(false);
    expect(input.checked).toBe(true);
  });
});
