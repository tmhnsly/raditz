import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './MotionCard.stories';
import { MotionCard } from './MotionCard';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('MotionCard', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders a link with the arrow affordance when given an href', () => {
    const { container } = render(<MotionCard href="#" title="Open" tone="accent" />);
    const link = container.querySelector('a.rdz-motion-card');
    expect(link).toBeTruthy();
    expect(link?.classList.contains('rdz-card-arrow-host')).toBe(true);
    expect(container.querySelector('.rdz-card-arrow')).toBeTruthy();
  });

  it('is a non-interactive div with no arrow when not clickable', () => {
    const { container } = render(<MotionCard title="Static" tone="mono" />);
    expect(container.querySelector('a.rdz-motion-card')).toBeNull();
    expect(container.querySelector('.rdz-card-arrow')).toBeNull();
  });
});
