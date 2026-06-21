import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Stats.stories';
import { StatsA, StatsB } from './Stats';

const composed = composeStories(stories);

describe('Stats (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('StatsA renders all stat values and labels', () => {
    render(
      <StatsA
        stats={[
          { value: '53', label: 'components' },
          { value: '188', label: 'design tokens' },
        ]}
      />,
    );
    expect(screen.getByText('53')).toBeTruthy();
    expect(screen.getByText('components')).toBeTruthy();
    expect(screen.getByText('188')).toBeTruthy();
    expect(screen.getByText('design tokens')).toBeTruthy();
  });

  it('StatsA children override auto-rendered body', () => {
    render(
      <StatsA stats={[{ value: '999', label: 'hidden' }]}>
        <div data-testid="statsoverride">Custom stats</div>
      </StatsA>,
    );
    expect(screen.getByTestId('statsoverride')).toBeTruthy();
    expect(screen.queryByText('999')).toBeNull();
    expect(screen.queryByText('hidden')).toBeNull();
  });

  it('StatsB renders band stat values and labels', () => {
    render(
      <StatsB
        stats={[
          { value: '99.9%', label: 'uptime' },
          { value: '40ms', label: 'p95 latency' },
        ]}
      />,
    );
    expect(screen.getByText('99.9%')).toBeTruthy();
    expect(screen.getByText('uptime')).toBeTruthy();
    expect(screen.getByText('40ms')).toBeTruthy();
    expect(screen.getByText('p95 latency')).toBeTruthy();
  });

  it('StatsB children override auto-rendered body', () => {
    render(
      <StatsB stats={[{ value: '0', label: 'hidden' }]}>
        <div data-testid="bandbody">Band override</div>
      </StatsB>,
    );
    expect(screen.getByTestId('bandbody')).toBeTruthy();
    expect(screen.queryByText('0')).toBeNull();
    expect(screen.queryByText('hidden')).toBeNull();
  });

  it('StatsA renders heading above the grid', () => {
    render(<StatsA stats={[{ value: '1', label: 'x' }]} heading="My Stats" />);
    expect(screen.getByText('My Stats')).toBeTruthy();
  });

  it('StatsB renders heading above the grid', () => {
    render(<StatsB stats={[{ value: '1', label: 'x' }]} heading="My Stats" />);
    expect(screen.getByText('My Stats')).toBeTruthy();
  });
});
