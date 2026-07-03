import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Scene } from './Scene';
import * as stories from './Scene.stories';

const composed = composeStories(stories);

describe('Scene (stories)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('Scene', () => {
  it('rides data-preset / data-bg and hides itself from the a11y tree', () => {
    const { container } = render(<Scene preset="orbit" bg="accent" />);
    const el = container.querySelector('.rdz-scene') as HTMLElement;
    expect(el.getAttribute('data-preset')).toBe('orbit');
    expect(el.getAttribute('data-bg')).toBe('accent');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('composes the expected marks per preset', () => {
    const { container: pulse } = render(<Scene preset="pulse" />);
    expect(pulse.querySelectorAll('.rdz-scene__ring')).toHaveLength(3);
    expect(pulse.querySelectorAll('.rdz-scene__spark')).toHaveLength(5);
    expect(pulse.querySelector('.rdz-scene__core')).toBeTruthy();

    const { container: bars } = render(<Scene preset="bars" />);
    expect(bars.querySelectorAll('.rdz-scene__bar')).toHaveLength(7);

    const { container: grid } = render(<Scene preset="grid" />);
    expect(grid.querySelectorAll('.rdz-scene__cell')).toHaveLength(16);

    const { container: burst } = render(<Scene preset="burst" />);
    expect(burst.querySelectorAll('.rdz-scene__particle')).toHaveLength(9);
  });

  it('sets ratio + tone as custom properties (not inline paint/animation)', () => {
    const { container } = render(<Scene preset="pulse" ratio="1 / 1" tone="var(--danger)" />);
    const el = container.querySelector('.rdz-scene') as HTMLElement;
    expect(el.style.getPropertyValue('--rdz-scene-ratio')).toBe('1 / 1');
    expect(el.style.getPropertyValue('--rdz-scene-color')).toBe('var(--danger)');
  });

  it('fill + paused toggle their modifier classes', () => {
    const { container } = render(<Scene preset="grid" fill paused />);
    const el = container.querySelector('.rdz-scene') as HTMLElement;
    expect(el.classList.contains('rdz-scene--fill')).toBe(true);
    expect(el.classList.contains('is-paused')).toBe(true);
  });
});
