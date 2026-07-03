import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from './Timeline';
import type { TimelineItem } from './Timeline';

const ITEMS: TimelineItem[] = [
  { meta: 'Jan 2026', title: 'Kick-off', description: 'Scoped the brief.' },
  { title: 'Design system', tone: 'accent' },
  { meta: 'Jun 2026', title: 'Launch', tone: 'done' },
];

describe('Timeline', () => {
  it('renders semantic ordered-list markup with one entry per item', () => {
    render(<Timeline items={ITEMS} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(list.getAttribute('data-orientation')).toBe('vertical');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('rides tone on a data attribute per item', () => {
    render(<Timeline items={ITEMS} />);
    const [first, second, third] = screen.getAllByRole('listitem');
    expect(first.getAttribute('data-tone')).toBe('default');
    expect(second.getAttribute('data-tone')).toBe('accent');
    expect(third.getAttribute('data-tone')).toBe('done');
  });

  it('renders meta and description only when provided', () => {
    const { container } = render(<Timeline items={ITEMS} />);
    expect(screen.getByText('Jan 2026')).toBeTruthy();
    expect(screen.getByText('Scoped the brief.')).toBeTruthy();
    const [, second] = screen.getAllByRole('listitem');
    expect(second.querySelector('.rdz-timeline__meta')).toBeNull();
    expect(second.querySelector('.rdz-timeline__description')).toBeNull();
    expect(container.querySelectorAll('.rdz-timeline__meta')).toHaveLength(2);
  });

  it('forwards className and rest props to the root', () => {
    render(<Timeline items={ITEMS} className="extra" aria-label="Roadmap" />);
    const list = screen.getByRole('list', { name: 'Roadmap' });
    expect(list.className).toContain('rdz-timeline');
    expect(list.className).toContain('extra');
  });
});
