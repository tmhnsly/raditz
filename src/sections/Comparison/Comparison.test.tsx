import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Comparison.stories';
import { ComparisonA } from './Comparison';

const composed = composeStories(stories);

describe('Comparison (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders column names in the header', () => {
    const { getByText } = render(
      <ComparisonA
        columns={[{ name: 'Free' }, { name: 'Pro', highlight: true }]}
        rows={[{ feature: 'Storage', values: ['1 GB', '100 GB'] }]}
      />,
    );
    getByText('Free');
    getByText('Pro');
    getByText('Storage');
  });

  it('renders true value as check glyph (✓)', () => {
    const { getAllByText } = render(
      <ComparisonA
        columns={[{ name: 'Plan A' }]}
        rows={[{ feature: 'Dark mode', values: [true] }]}
      />,
    );
    const checks = getAllByText('✓');
    expect(checks.length).toBeGreaterThan(0);
  });

  it('renders false value as cross/em-dash (—)', () => {
    const { getAllByText } = render(
      <ComparisonA
        columns={[{ name: 'Plan A' }]}
        rows={[{ feature: 'SSO', values: [false] }]}
      />,
    );
    const dashes = getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('renders a ReactNode value as-is', () => {
    const { getByText } = render(
      <ComparisonA
        columns={[{ name: 'Plan A' }]}
        rows={[{ feature: 'Projects', values: ['Unlimited'] }]}
      />,
    );
    getByText('Unlimited');
  });

  it('children override auto-rendered table', () => {
    const { getByText, queryByText } = render(
      <ComparisonA
        columns={[{ name: 'Hidden Col' }]}
        rows={[{ feature: 'Hidden Row', values: ['x'] }]}
      >
        <span>custom comparison</span>
      </ComparisonA>,
    );
    getByText('custom comparison');
    expect(queryByText('Hidden Col')).toBeNull();
    expect(queryByText('Hidden Row')).toBeNull();
  });
});
