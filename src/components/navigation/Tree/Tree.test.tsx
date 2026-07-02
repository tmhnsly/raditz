import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { Tree, type TreeNode } from './Tree';
import * as stories from './Tree.stories';

const composed = composeStories(stories);

const items: TreeNode[] = [
  { id: 'a', label: 'A', children: [{ id: 'a1', label: 'A1' }, { id: 'a2', label: 'A2' }] },
  { id: 'b', label: 'B' },
];

describe('Tree (stories)', () => {
  for (const [name, Story] of Object.entries(composed)) {
    it(`renders the ${name} story`, () => {
      const { container } = render(<Story />);
      expect(container.querySelector('[role="tree"]')).toBeTruthy();
    });
  }
});

const folderRow = (): HTMLElement => screen.getByText('A').closest('[role="treeitem"]') as HTMLElement;
const twist = (row: HTMLElement): HTMLElement => row.querySelector('.rdz-tree__twist') as HTMLElement;

describe('Tree (behaviour)', () => {
  it('clicking a folder name selects it (onSelect fires for branches) without toggling', () => {
    const onSelect = vi.fn();
    render(<Tree aria-label="t" items={items} onSelect={onSelect} />);
    const folder = folderRow();
    expect(folder.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(folder);
    expect(onSelect).toHaveBeenCalledWith('a', expect.objectContaining({ id: 'a' }));
    expect(folder.getAttribute('aria-selected')).toBe('true');
    // The name click did NOT expand — that's the chevron's job.
    expect(folder.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('A1')).toBeNull();
  });

  it('clicking the chevron toggles the folder open and closed without selecting', () => {
    const onSelect = vi.fn();
    render(<Tree aria-label="t" items={items} onSelect={onSelect} />);
    const folder = folderRow();

    fireEvent.click(twist(folder));
    expect(folder.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('A1')).toBeTruthy();

    fireEvent.click(twist(folder));
    expect(folder.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('A1')).toBeNull();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('toggleOnRowClick opts back into file-browser row-click toggling', () => {
    render(<Tree aria-label="t" items={items} toggleOnRowClick />);
    const folder = folderRow();
    fireEvent.click(folder);
    expect(folder.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(folder);
    expect(folder.getAttribute('aria-expanded')).toBe('false');
  });

  it('selecting a node fires onSelect with id and node', () => {
    const onSelect = vi.fn();
    render(<Tree aria-label="t" items={items} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('B').closest('[role="treeitem"]')!);
    expect(onSelect).toHaveBeenCalledWith('b', expect.objectContaining({ id: 'b' }));
  });

  it('ArrowRight expands and ArrowLeft collapses a folder (keyboard preserved)', () => {
    render(<Tree aria-label="t" items={items} />);
    const folder = folderRow();
    folder.focus();
    fireEvent.keyDown(folder, { key: 'ArrowRight' });
    expect(folder.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(folder, { key: 'ArrowLeft' });
    expect(folder.getAttribute('aria-expanded')).toBe('false');
  });

  it('Enter selects the focused row (no toggle by default)', () => {
    const onSelect = vi.fn();
    render(<Tree aria-label="t" items={items} onSelect={onSelect} />);
    const folder = folderRow();
    folder.focus();
    fireEvent.keyDown(folder, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('a', expect.objectContaining({ id: 'a' }));
    expect(folder.getAttribute('aria-expanded')).toBe('false');
  });
});
