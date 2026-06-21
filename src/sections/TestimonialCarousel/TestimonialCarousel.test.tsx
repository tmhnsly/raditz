import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './TestimonialCarousel.stories';
import { TestimonialCarouselA } from './TestimonialCarousel';

const composed = composeStories(stories);

const SAMPLE_QUOTES = [
  {
    quote: 'Carousel quote one',
    avatar: <span className="rdz-avatar">AA</span>,
    name: 'Alice',
    role: 'Engineer',
  },
  {
    quote: 'Carousel quote two',
    avatar: <span className="rdz-avatar">BB</span>,
    name: 'Bob',
    role: 'Designer',
  },
];

describe('TestimonialCarousel (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('TestimonialCarouselA renders all quotes', () => {
    const { getByText } = render(<TestimonialCarouselA quotes={SAMPLE_QUOTES} />);
    getByText('Carousel quote one');
    getByText('Alice');
    getByText('Engineer');
    getByText('Carousel quote two');
    getByText('Bob');
    getByText('Designer');
  });

  it('TestimonialCarouselA renders heading when provided', () => {
    const { getByText } = render(
      <TestimonialCarouselA quotes={SAMPLE_QUOTES} heading="Trusted by teams" />,
    );
    getByText('Trusted by teams');
  });

  it('TestimonialCarouselA children override replaces auto-rendered body', () => {
    const { getByText, queryByText } = render(
      <TestimonialCarouselA quotes={SAMPLE_QUOTES}>
        <p>custom carousel</p>
      </TestimonialCarouselA>,
    );
    getByText('custom carousel');
    expect(queryByText('Carousel quote one')).toBeNull();
  });
});
