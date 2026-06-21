import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Testimonials.stories';
import { TestimonialsA, TestimonialsB } from './Testimonials';

const composed = composeStories(stories);

const SAMPLE_QUOTES = [
  {
    quote: 'First quote',
    avatar: <span className="rdz-avatar">AA</span>,
    name: 'Alice',
    role: 'Engineer',
  },
  {
    quote: 'Second quote',
    avatar: <span className="rdz-avatar">BB</span>,
    name: 'Bob',
    role: 'Designer',
  },
];

describe('Testimonials (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('TestimonialsA renders all quotes', () => {
    const { getByText } = render(<TestimonialsA quotes={SAMPLE_QUOTES} />);
    getByText('First quote');
    getByText('Alice');
    getByText('Engineer');
    getByText('Second quote');
    getByText('Bob');
    getByText('Designer');
  });

  it('TestimonialsB renders the first quote', () => {
    const { getByText } = render(<TestimonialsB quotes={SAMPLE_QUOTES} />);
    getByText('First quote');
    getByText('Alice');
    getByText('Engineer');
  });

  it('TestimonialsA renders heading when provided', () => {
    const { getByText } = render(
      <TestimonialsA quotes={SAMPLE_QUOTES} heading="What our customers say" />,
    );
    getByText('What our customers say');
  });

  it('TestimonialsB renders heading when provided', () => {
    const { getByText } = render(
      <TestimonialsB quotes={SAMPLE_QUOTES} heading="Customer story" />,
    );
    getByText('Customer story');
  });

  it('TestimonialsA children override replaces auto-rendered body', () => {
    const { getByText, queryByText } = render(
      <TestimonialsA quotes={SAMPLE_QUOTES}>
        <p>custom testimonials</p>
      </TestimonialsA>,
    );
    getByText('custom testimonials');
    expect(queryByText('First quote')).toBeNull();
  });

  it('TestimonialsB children override replaces auto-rendered body', () => {
    const { getByText, queryByText } = render(
      <TestimonialsB quotes={SAMPLE_QUOTES}>
        <p>custom single quote</p>
      </TestimonialsB>,
    );
    getByText('custom single quote');
    expect(queryByText('First quote')).toBeNull();
  });
});
