import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './StorySplit.stories';
import { StorySplitA, type StorySplitItem } from './StorySplit';

const composed = composeStories(stories);

const ITEMS: StorySplitItem[] = [
  { image: '/one.jpg', imageAlt: 'First image', title: 'Row one' },
  { image: '/two.jpg', imageAlt: 'Second image', title: 'Row two' },
  { image: '/three.jpg', imageAlt: 'Third image', title: 'Row three' },
];

describe('StorySplitA (section)', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders one row per item, with the section header', () => {
    const { container } = render(
      <StorySplitA eyebrow="Journey" heading="Three days" items={ITEMS} />,
    );
    expect(container.querySelectorAll('.sx-story__row')).toHaveLength(3);
    expect(screen.getByText('Journey')).toBeTruthy();
    expect(screen.getByText('Three days')).toBeTruthy();
    expect(screen.getByText('Row one')).toBeTruthy();
    expect(screen.getByAltText('Second image')).toBeTruthy();
  });

  it('alternates: even rows (2nd, 4th…) carry data-flip, odd rows do not', () => {
    const { container } = render(<StorySplitA items={ITEMS} />);
    const rows = Array.from(container.querySelectorAll('.sx-story__row'));
    expect(rows.map((row) => row.hasAttribute('data-flip'))).toEqual([false, true, false]);
  });

  it('media node takes precedence over image', () => {
    const { container } = render(
      <StorySplitA
        items={[
          { image: '/photo.jpg', imageAlt: 'Should not render', media: <div data-testid="custom-media" />, title: 'Row' },
        ]}
      />,
    );
    expect(screen.getByTestId('custom-media')).toBeTruthy();
    expect(screen.queryByAltText('Should not render')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });

  it('renders an item action as a link with its label and href', () => {
    render(
      <StorySplitA
        items={[{ title: 'Row', action: { label: 'Book the trip', href: '/book' } }]}
      />,
    );
    const link = screen.getByRole('link', { name: 'Book the trip' });
    expect(link.getAttribute('href')).toBe('/book');
  });

  it('renders item eyebrow and body copy', () => {
    render(<StorySplitA items={[{ eyebrow: 'The route', title: 'Row', body: 'Above the treeline.' }]} />);
    expect(screen.getByText('The route')).toBeTruthy();
    expect(screen.getByText('Above the treeline.')).toBeTruthy();
  });

  it('children override replaces the auto-rendered body', () => {
    render(
      <StorySplitA items={ITEMS} heading="unused heading">
        <p>custom body</p>
      </StorySplitA>,
    );
    expect(screen.getByText('custom body')).toBeTruthy();
    expect(screen.queryByText('Row one')).toBeNull();
    expect(screen.queryByText('unused heading')).toBeNull();
  });

  it('SectionBaseProps passthrough: className, id and data-* reach the section root', () => {
    render(
      <StorySplitA items={ITEMS} className="my-story" id="journey" data-testid="story-root" />,
    );
    const root = screen.getByTestId('story-root');
    expect(root.className).toContain('my-story');
    expect(root.id).toBe('journey');
  });
});
