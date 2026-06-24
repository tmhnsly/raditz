import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Form.stories';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Form', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('reveals a `when` field only once its condition is met', () => {
    render(<composed.ConditionalField />);
    // Hidden initially (reason !== 'Other').
    expect(screen.queryByLabelText(/please specify/i)).toBeNull();
    // Selecting "Other" reveals it.
    fireEvent.change(screen.getByLabelText(/reason for contact/i), { target: { value: 'Other' } });
    expect(screen.getByLabelText(/please specify/i)).toBeTruthy();
    // Switching away hides it again.
    fireEvent.change(screen.getByLabelText(/reason for contact/i), { target: { value: 'sales' } });
    expect(screen.queryByLabelText(/please specify/i)).toBeNull();
  });
});
