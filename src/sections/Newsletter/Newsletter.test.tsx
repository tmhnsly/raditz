import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Newsletter.stories';
import { NewsletterA } from './Newsletter';

const composed = composeStories(stories);

describe('Newsletter (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders required action button', () => {
    render(<NewsletterA action={{ label: 'Subscribe now' }} />);
    expect(screen.getByText('Subscribe now')).toBeTruthy();
  });

  it('children override the body', () => {
    render(
      <NewsletterA action={{ label: 'unused' }}>
        <span>override content</span>
      </NewsletterA>,
    );
    expect(screen.getByText('override content')).toBeTruthy();
    expect(screen.queryByText('unused')).toBeNull();
  });
});
