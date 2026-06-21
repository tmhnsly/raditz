import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Hero.stories';
import { HeroA } from './Hero';

const composed = composeStories(stories);

describe('Hero (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders the required title and optional content', () => {
    render(
      <HeroA
        title="Frequency DJ Studio"
        eyebrow="Booking 2026"
        lede="Pro decks."
        actions={[{ label: 'Book', href: '/book' }]}
      />,
    );
    expect(screen.getByText('Frequency DJ Studio')).toBeTruthy();
    expect(screen.getByText('Booking 2026')).toBeTruthy();
    expect(screen.getByText('Pro decks.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Book' }).getAttribute('href')).toBe('/book');
  });

  it('children override the auto-rendered body', () => {
    render(
      <HeroA title="ignored">
        <div data-testid="custom">Custom</div>
      </HeroA>,
    );
    expect(screen.getByTestId('custom')).toBeTruthy();
    expect(screen.queryByText('ignored')).toBeNull();
  });
});
