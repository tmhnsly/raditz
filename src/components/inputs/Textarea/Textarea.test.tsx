import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Textarea.stories';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Textarea', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});
