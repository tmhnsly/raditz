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

describe('Tree (behaviour)', () => {
  it('clicking a folder toggles it open and closed (file-browser style)', () => {
    render(<Tree aria-label="t" items={items} />);
    const folder = screen.getByText('A').closest('[role="treeitem"]')!;
    expect(folder.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('A1')).toBeNull();

    fireEvent.click(folder);
    expect(folder.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('A1')).toBeTruthy();

    fireEvent.click(folder);
    expect(folder.getAttribute('aria-expanded')).toBe('false');
  });

  it('selecting a node fires onSelect with id and node', () => {
    const onSelect = vi.fn();
    render(<Tree aria-label="t" items={items} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('B').closest('[role="treeitem"]')!);
    expect(onSelect).toHaveBeenCalledWith('b', expect.objectContaining({ id: 'b' }));
  });

  it('ArrowRight expands a collapsed folder', () => {
    render(<Tree aria-label="t" items={items} />);
    const folder = screen.getByText('A').closest('[role="treeitem"]') as HTMLElement;
    folder.focus();
    fireEvent.keyDown(folder, { key: 'ArrowRight' });
    expect(folder.getAttribute('aria-expanded')).toBe('true');
  });
});
