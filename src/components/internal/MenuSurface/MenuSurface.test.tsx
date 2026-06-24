import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuSurface } from './MenuSurface';
import type { MenuItem } from './MenuSurface';

function items(onA = () => {}, onB = () => {}): MenuItem[] {
  return [
    { heading: true, label: 'Section' },
    { label: 'A', onSelect: onA },
    { separator: true },
    { label: 'Disabled', disabled: true },
    { label: 'B', onSelect: onB },
  ];
}

describe('MenuSurface — shared roving menu behavior', () => {
  it('renders headings, separators, and menuitems from the data model', () => {
    render(<MenuSurface open onDismiss={() => {}} items={items()} point={{ x: 10, y: 10 }} />);
    expect(screen.getAllByRole('menuitem')).toHaveLength(3); // A, Disabled, B
    expect(screen.getByRole('separator')).toBeTruthy();
  });

  it('focuses the first enabled item on open', () => {
    render(<MenuSurface open onDismiss={() => {}} items={items()} point={{ x: 10, y: 10 }} />);
    expect((document.activeElement as HTMLElement).textContent).toBe('A');
  });

  it('ArrowDown roves to the next ENABLED item, skipping disabled', () => {
    render(<MenuSurface open onDismiss={() => {}} items={items()} point={{ x: 10, y: 10 }} />);
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });
    expect((document.activeElement as HTMLElement).textContent).toBe('B');
  });

  it('ArrowUp from the first item wraps to the last enabled item', () => {
    render(<MenuSurface open onDismiss={() => {}} items={items()} point={{ x: 10, y: 10 }} />);
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowUp' });
    expect((document.activeElement as HTMLElement).textContent).toBe('B');
  });

  it('clicking an item fires onSelect and dismisses', () => {
    const onA = vi.fn();
    const onDismiss = vi.fn();
    render(<MenuSurface open onDismiss={onDismiss} items={items(onA)} point={{ x: 10, y: 10 }} />);
    fireEvent.click(screen.getByText('A'));
    expect(onA).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not select disabled items', () => {
    const onDismiss = vi.fn();
    render(<MenuSurface open onDismiss={onDismiss} items={items()} point={{ x: 10, y: 10 }} />);
    fireEvent.click(screen.getByText('Disabled'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismisses on Escape', () => {
    const onDismiss = vi.fn();
    render(<MenuSurface open onDismiss={onDismiss} items={items()} point={{ x: 10, y: 10 }} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
