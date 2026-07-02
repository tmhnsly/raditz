import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './DropdownMenu.stories';
import { DropdownMenu } from './DropdownMenu';
import type { MenuItem } from './DropdownMenu';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('DropdownMenu', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const items = (onSelect?: () => void): MenuItem[] => [
  { label: 'Copy', onSelect },
  { label: 'Paste' },
  { separator: true },
  { label: 'Delete', danger: true },
];

describe('DropdownMenu (behaviour)', () => {
  it('opens on trigger click and renders menuitems', () => {
    render(<DropdownMenu trigger={<button>Menu</button>} items={items()} />);
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(screen.getAllByRole('menuitem').map((el) => el.textContent)).toEqual(['Copy', 'Paste', 'Delete']);
  });

  it('defaultOpen renders the menu open; arrow keys move the roving focus', () => {
    render(<DropdownMenu trigger={<button>Menu</button>} items={items()} defaultOpen />);
    // Opening focuses the first enabled item.
    expect((document.activeElement as HTMLElement).textContent).toBe('Copy');
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
    expect((document.activeElement as HTMLElement).textContent).toBe('Paste');
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' });
    expect((document.activeElement as HTMLElement).textContent).toBe('Copy');
  });

  it('clicking an item fires onSelect and closes the menu', () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(<DropdownMenu trigger={<button>Menu</button>} items={items(onSelect)} defaultOpen onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByText('Copy'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('Escape closes the menu and returns focus to the trigger', () => {
    render(<DropdownMenu trigger={<button>Menu</button>} items={items()} />);
    const trigger = screen.getByText('Menu');
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeTruthy();
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('controlled: open renders, and interactions report through onOpenChange', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <DropdownMenu trigger={<button>Menu</button>} items={items()} open={false} onOpenChange={onOpenChange} />,
    );
    fireEvent.click(screen.getByText('Menu'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).toBeNull(); // parent owns the state
    rerender(<DropdownMenu trigger={<button>Menu</button>} items={items()} open onOpenChange={onOpenChange} />);
    expect(screen.getByRole('menu')).toBeTruthy();
  });
});
