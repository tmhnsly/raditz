import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Gallery.stories';
import { GalleryA, GalleryB } from './Gallery';

const composed = composeStories(stories);

const demoImages = [
  { src: 'a.jpg', alt: 'Alpha peak' },
  { src: 'b.jpg', alt: 'Beta lake', caption: 'The lake at dawn' },
  { src: 'c.jpg', alt: 'Gamma trail' },
];

describe('Gallery (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('A delegates to the media Gallery component and renders the header', () => {
    const { container } = render(
      <GalleryA
        eyebrow="Gallery"
        heading="Field notes"
        lede="A supporting line"
        images={demoImages}
        columns={4}
      />,
    );
    screen.getByText('Gallery');
    screen.getByText('Field notes');
    screen.getByText('A supporting line');
    // the media Gallery grid renders one interactive cell per image…
    const grid = container.querySelector('.rdz-gallery');
    expect(grid).toBeTruthy();
    expect(container.querySelectorAll('.rdz-gallery__cell').length).toBe(demoImages.length);
    // …and receives the forwarded `columns` prop.
    expect((grid as HTMLElement).style.getPropertyValue('--rdz-gallery-cols')).toBe('4');
  });

  it('B renders masonry column classes with figures and optional captions', () => {
    const { container } = render(<GalleryB heading="Archive" images={demoImages} />);
    expect(container.querySelector('.sx-gal__masonry')).toBeTruthy();
    const figs = container.querySelectorAll('figure.sx-gal__fig');
    expect(figs.length).toBe(demoImages.length);
    // only the captioned image gets a figcaption
    expect(container.querySelectorAll('figcaption').length).toBe(1);
    screen.getByText('The lake at dawn');
    // no lightbox grid — B owns its own figure markup
    expect(container.querySelector('.rdz-gallery')).toBeNull();
  });

  it('B renders every image with its alt text', () => {
    render(<GalleryB images={demoImages} />);
    for (const im of demoImages) screen.getByAltText(im.alt);
  });

  it('children override the auto-rendered body (A and B)', () => {
    const a = render(
      <GalleryA images={demoImages}>
        <span>custom A body</span>
      </GalleryA>,
    );
    a.getByText('custom A body');
    expect(a.container.querySelector('.rdz-gallery')).toBeNull();

    const b = render(
      <GalleryB images={demoImages}>
        <span>custom B body</span>
      </GalleryB>,
    );
    b.getByText('custom B body');
    expect(b.container.querySelector('.sx-gal__masonry')).toBeNull();
  });

  it('SectionBaseProps pass through to the section root', () => {
    const { container } = render(
      <GalleryA
        images={demoImages}
        id="shots"
        className="my-gallery"
        data-testid="gal-root"
      />,
    );
    const root = screen.getByTestId('gal-root');
    expect(root.id).toBe('shots');
    expect(root.classList.contains('my-gallery')).toBe(true);
    expect(container.firstElementChild).toBe(root);
  });
});
