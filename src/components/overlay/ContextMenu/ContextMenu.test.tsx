import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './ContextMenu.stories';
import { ContextMenu } from './ContextMenu';
import type { MenuItem } from '../../internal/MenuSurface/MenuSurface';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('ContextMenu', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const items = (onSelect?: () => void): MenuItem[] => [
  { label: 'Rename', onSelect },
  { label: 'Duplicate' },
  { label: 'Delete', danger: true },
];

describe('ContextMenu (behaviour)', () => {
  it('opens on the contextmenu event and reports onOpenChange(true)', () => {
    const onOpenChange = vi.fn();
    render(<ContextMenu items={items()} onOpenChange={onOpenChange}><span>area</span></ContextMenu>);
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.contextMenu(screen.getByText('area'), { clientX: 40, clientY: 60 });
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getAllByRole('menuitem').map((el) => el.textContent)).toEqual(['Rename', 'Duplicate', 'Delete']);
  });

  it('defaultOpen renders the menu open (uncontrolled)', () => {
    render(<ContextMenu items={items()} defaultOpen><span>area</span></ContextMenu>);
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('arrow keys move the roving focus over items', () => {
    render(<ContextMenu items={items()}><span>area</span></ContextMenu>);
    fireEvent.contextMenu(screen.getByText('area'));
    expect((document.activeElement as HTMLElement).textContent).toBe('Rename');
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
    expect((document.activeElement as HTMLElement).textContent).toBe('Duplicate');
  });

  it('clicking an item fires onSelect and closes (onOpenChange(false))', () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(<ContextMenu items={items(onSelect)} onOpenChange={onOpenChange}><span>area</span></ContextMenu>);
    fireEvent.contextMenu(screen.getByText('area'));
    fireEvent.click(screen.getByText('Rename'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('Escape closes the menu', () => {
    render(<ContextMenu items={items()}><span>area</span></ContextMenu>);
    fireEvent.contextMenu(screen.getByText('area'));
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('controlled: right-click requests open without opening by itself', () => {
    const onOpenChange = vi.fn();
    render(<ContextMenu items={items()} open={false} onOpenChange={onOpenChange}><span>area</span></ContextMenu>);
    fireEvent.contextMenu(screen.getByText('area'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
