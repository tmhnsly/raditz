import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './FeaturesTabbed.stories';

const { Default } = composeStories(stories);

describe('FeaturesTabbed (section)', () => {
  it('renders the first tab open and switches panels on tab click', () => {
    render(<Default />);
    // First tab is selected by default.
    const firstTab = screen.getByRole('tab', { name: 'Private Hire' });
    expect(firstTab.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText(/up to two guests/i)).toBeTruthy();

    // Switching tabs swaps the panel content.
    fireEvent.click(screen.getByRole('tab', { name: 'Content Production' }));
    expect(screen.getByText(/Multi-camera recording/i)).toBeTruthy();
  });
});
