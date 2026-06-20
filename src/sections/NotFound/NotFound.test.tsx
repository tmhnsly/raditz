import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './NotFound.stories';
import { NotFoundA } from './NotFound';

const composed = composeStories(stories);

describe('NotFound (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders default title when none provided', () => {
    render(<NotFoundA />);
    expect(screen.getByText('Page not found')).toBeTruthy();
  });

  it('renders provided title', () => {
    render(<NotFoundA title="Custom 404" />);
    expect(screen.getByText('Custom 404')).toBeTruthy();
  });

  it('children override the body', () => {
    render(
      <NotFoundA title="unused">
        <span>override content</span>
      </NotFoundA>,
    );
    expect(screen.getByText('override content')).toBeTruthy();
    expect(screen.queryByText('unused')).toBeNull();
  });
});
