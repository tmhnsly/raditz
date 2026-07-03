import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { LineChart } from './LineChart';
import * as stories from './LineChart.stories';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('LineChart', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

describe('LineChart (multi-series)', () => {
  // jsdom has no layout, so ParentSize renders nothing under 10px — assert on the
  // mode/branch selection and empty handling rather than plotted geometry.
  it('renders the chart frame in series mode without throwing', () => {
    const { container } = render(
      <LineChart series={[{ name: 'A', data: [{ y: 1 }, { y: 2 }] }, { name: 'B', data: [{ y: 3 }, { y: 4 }] }]} />,
    );
    expect(container.querySelector('.rdz-chart')).toBeTruthy();
  });

  it('shows the empty notice when every series is empty', () => {
    const { container } = render(<LineChart series={[{ data: [] }, { data: [] }]} emptyMessage="Nothing yet" />);
    expect(container.querySelector('.rdz-chart__empty')?.textContent).toBe('Nothing yet');
  });
});
