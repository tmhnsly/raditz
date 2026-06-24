import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Lightbox.stories';
import { Lightbox } from './Lightbox';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('Lightbox', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('reset-zoom button returns the image to 1x', () => {
    render(<Lightbox defaultOpen images={[{ src: 'a.jpg' }, { src: 'b.jpg' }]} />);
    const img = document.querySelector('.rdz-lightbox__img') as HTMLImageElement;
    fireEvent.click(document.querySelector('[aria-label="Zoom in"]') as HTMLButtonElement);
    expect(img.style.getPropertyValue('--rdz-lb-scale')).not.toBe('1');
    fireEvent.click(document.querySelector('[aria-label="Reset zoom"]') as HTMLButtonElement);
    expect(img.style.getPropertyValue('--rdz-lb-scale')).toBe('1');
  });
});
