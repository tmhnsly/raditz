import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './AnimatedIcon.stories';
import { AnimatedIcon } from './AnimatedIcon';
import { Icon } from '../../display/Icon/Icon';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('AnimatedIcon', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('applies the anim class and renders its child icon', () => {
    const { container } = render(<AnimatedIcon anim="float"><Icon name="star" /></AnimatedIcon>);
    const wrap = container.querySelector('.rdz-anim');
    expect(wrap).toBeTruthy();
    expect(wrap?.classList.contains('rdz-anim--float')).toBe(true);
    expect(wrap?.querySelector('svg')).toBeTruthy();
  });
});
