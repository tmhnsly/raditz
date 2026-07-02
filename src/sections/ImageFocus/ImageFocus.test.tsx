import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './ImageFocus.stories';
import { ImageFocus } from './ImageFocus';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('ImageFocus (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('lands data-size/data-place on the .rdz-imgfocus frame root (the CSS selector target)', () => {
    const { container } = render(<ImageFocus image="/x.jpg" title="T" size="hero" place="bottom" />);
    const root = container.querySelector('.rdz-imgfocus') as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.classList.contains('frame')).toBe(true);
    expect(root.getAttribute('data-size')).toBe('hero');
    expect(root.getAttribute('data-place')).toBe('bottom');
    // `.rdz-imgfocus[data-size] > .rdz-secbg` must keep matching: the backdrop
    // is a direct child of the attribute-bearing root.
    expect(root.querySelector(':scope > .rdz-secbg')).toBeTruthy();
  });
});
