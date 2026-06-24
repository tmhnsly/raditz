import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Reveal.stories';
import { Reveal } from './Reveal';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Reveal', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('always renders its children (content is in the DOM even before reveal)', () => {
    const { getByText } = render(<Reveal>Hello content</Reveal>);
    expect(getByText('Hello content')).toBeTruthy();
  });
});
