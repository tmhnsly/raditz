import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Spotlight.stories';
import { SpotlightA } from './Spotlight';

const { Default } = composeStories(stories);

const ITEMS = [{ title: 'Card one', scene: <svg aria-hidden="true" /> }];

describe('SpotlightA (section)', () => {
  it('renders a clickable card per item with its title', () => {
    render(<Default />);
    expect(screen.getByText('Private Hire')).toBeTruthy();
    expect(screen.getByText('Coaching')).toBeTruthy();
    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(3);
  });

  it('children override replaces the auto-rendered body', () => {
    render(
      <SpotlightA items={ITEMS} heading="unused heading">
        <p>custom body</p>
      </SpotlightA>,
    );
    expect(screen.getByText('custom body')).toBeTruthy();
    expect(screen.queryByText('Card one')).toBeNull();
    expect(screen.queryByText('unused heading')).toBeNull();
  });

  it('centers the header by default and honours align="start"', () => {
    const { container, rerender } = render(<SpotlightA items={ITEMS} heading="Head" />);
    expect(container.querySelector('.sx-feat__head')?.className).toContain('sx-center');
    rerender(<SpotlightA items={ITEMS} heading="Head" align="start" />);
    expect(container.querySelector('.sx-feat__head')?.className).toContain('sx-align-start');
  });
});
