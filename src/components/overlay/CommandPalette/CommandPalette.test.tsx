import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './CommandPalette.stories';
import { CommandPalette } from './CommandPalette';
import type { CommandGroup } from './CommandPalette';

// Smoke test: every exported story renders without throwing.
const composed = composeStories(stories);

describe('CommandPalette', () => {
  for (const [storyName, Story] of Object.entries(composed)) {
    it(`renders the ${storyName} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }
});

const groups = (onSelect?: () => void): CommandGroup[] => [
  { heading: 'General', items: [{ id: 'a', label: 'Open settings', onSelect }, { id: 'b', label: 'New file' }] },
];

describe('CommandPalette (behaviour)', () => {
  it('renders only while open (controlled)', () => {
    const { rerender } = render(<CommandPalette open={false} groups={groups()} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<CommandPalette open groups={groups()} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Open settings')).toBeTruthy();
  });

  it('defaultOpen works uncontrolled and Escape closes it', () => {
    render(<CommandPalette defaultOpen groups={groups()} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Escape requests close via onOpenChange(false) when controlled', () => {
    const onOpenChange = vi.fn();
    render(<CommandPalette open onOpenChange={onOpenChange} groups={groups()} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('the ⌘K hotkey toggles an uncontrolled palette', () => {
    render(<CommandPalette groups={groups()} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('moves focus into the panel on open (the search input)', () => {
    render(<CommandPalette defaultOpen groups={groups()} />);
    const panel = screen.getByRole('dialog');
    expect(panel.contains(document.activeElement)).toBe(true);
    expect((document.activeElement as HTMLElement).tagName).toBe('INPUT');
  });

  it('clicking a command fires its onSelect and closes the palette', () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(<CommandPalette defaultOpen onOpenChange={onOpenChange} groups={groups(onSelect)} />);
    fireEvent.click(screen.getByText('Open settings'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
