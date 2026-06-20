import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Marquee.stories';
import { MarqueeA } from './Marquee';

const composed = composeStories(stories);

describe('Marquee (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders required items', () => {
    render(
      <MarqueeA items={[<span key="1">Logo A</span>, <span key="2">Logo B</span>]} />,
    );
    // MarqueeStrip duplicates items for the seamless loop
    expect(screen.getAllByText('Logo A').length).toBeGreaterThan(0);
  });

  it('children override the body', () => {
    render(
      <MarqueeA items={[<span key="1">unused</span>]}>
        <span>override content</span>
      </MarqueeA>,
    );
    expect(screen.getByText('override content')).toBeTruthy();
    expect(screen.queryByText('unused')).toBeNull();
  });
});
