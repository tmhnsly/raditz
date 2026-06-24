import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './CardArrow.stories';
import { CardArrow } from './CardArrow';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('CardArrow', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('is decorative (aria-hidden) and shows the in-site arrow by default', () => {
    const { container } = render(<CardArrow />);
    const el = container.querySelector('.rdz-card-arrow');
    expect(el?.getAttribute('aria-hidden')).toBe('true');
    expect(el?.classList.contains('rdz-card-arrow--external')).toBe(false);
    expect(el?.querySelectorAll('svg').length).toBe(1);
  });

  it('marks external links with the diagonal variant', () => {
    const { container } = render(<CardArrow external />);
    expect(container.querySelector('.rdz-card-arrow')?.classList.contains('rdz-card-arrow--external')).toBe(true);
  });
});
