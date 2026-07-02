import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './FeaturesTabbed.stories';
import { FeaturesTabbed } from './FeaturesTabbed';

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

  it('children override replaces the auto-rendered body', () => {
    render(
      <FeaturesTabbed items={[{ label: 'Unused tab', description: 'unused' }]} heading="unused heading">
        <p>custom body</p>
      </FeaturesTabbed>,
    );
    expect(screen.getByText('custom body')).toBeTruthy();
    expect(screen.queryByText('Unused tab')).toBeNull();
    expect(screen.queryByText('unused heading')).toBeNull();
  });
});
