import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Spotlight.stories';

const { Default } = composeStories(stories);

describe('SpotlightA (section)', () => {
  it('renders a clickable card per item with its title', () => {
    render(<Default />);
    expect(screen.getByText('Private Hire')).toBeTruthy();
    expect(screen.getByText('Coaching')).toBeTruthy();
    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(3);
  });
});
