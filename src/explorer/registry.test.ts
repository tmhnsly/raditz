/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import { entries, buildTree, entriesUnder, findNode, ancestorsOf, filterTree, allBranchIds } from './registry';
import type { TreeNode as TreeItem } from '../components/navigation/Tree';

describe('story registry', () => {
  it('discovers stories from every area of the library', () => {
    const titles = entries.map((e) => e.title);
    expect(titles.some((t) => t.startsWith('Foundations/'))).toBe(true);
    expect(titles.some((t) => t.startsWith('Components/'))).toBe(true);
    expect(titles.some((t) => t.startsWith('Sections/'))).toBe(true);
    expect(titles.some((t) => t.startsWith('Pages/'))).toBe(true);
  });

  it('derives kebab slugs and at least one variant per entry', () => {
    const button = entries.find((e) => e.title === 'Components/Actions/Button');
    expect(button).toBeDefined();
    expect(button!.slug).toBe('components/actions/button');
    expect(button!.variants.length).toBeGreaterThan(0);
    expect(button!.variants[0].Component).toBeTypeOf('function');
  });

  it('orders top-level groups smallest → largest (Foundations → Components → Sections → Pages → Demos)', () => {
    const order = ['Foundations', 'Components', 'Sections', 'Pages', 'Demos'];
    const top = buildTree().map((n) => n.name);
    const known = top.filter((n) => order.includes(n));
    const expected = order.filter((n) => known.includes(n));
    expect(known).toEqual(expected);
  });

  it('entriesUnder treats a branch slug as a prefix', () => {
    const all = entriesUnder('');
    expect(all.length).toBe(entries.length);
    const actions = entriesUnder('components/actions');
    expect(actions.length).toBeGreaterThan(1);
    expect(actions.every((e) => e.slug.startsWith('components/actions'))).toBe(true);
  });

  it('findNode locates branches and leaves by slug', () => {
    const tree = buildTree();
    expect(findNode(tree, 'components')?.name).toBe('Components');
    expect(findNode(tree, 'components/actions/button')?.entry?.title).toBe(
      'Components/Actions/Button',
    );
  });
});

describe('ancestorsOf', () => {
  it('returns empty array for empty slug', () => {
    expect(ancestorsOf('')).toEqual([]);
  });

  it('returns the slug itself for a single-segment slug', () => {
    expect(ancestorsOf('components')).toEqual(['components']);
  });

  it('returns all prefix slugs for a/b/c (includes the slug itself)', () => {
    expect(ancestorsOf('a/b/c')).toEqual(['a', 'a/b', 'a/b/c']);
  });

  it('returns two ancestors for a two-segment slug', () => {
    expect(ancestorsOf('components/controls')).toEqual(['components', 'components/controls']);
  });
});

describe('filterTree', () => {
  const tree: TreeItem[] = [
    {
      id: 'components',
      label: 'Components',
      children: [
        {
          id: 'components/controls',
          label: 'Controls',
          children: [
            { id: 'components/controls/button', label: 'Button' },
            { id: 'components/controls/input', label: 'Input' },
          ],
        },
        {
          id: 'components/feedback',
          label: 'Feedback',
          children: [
            { id: 'components/feedback/toast', label: 'Toast' },
          ],
        },
      ],
    },
    {
      id: 'foundations',
      label: 'Foundations',
      children: [
        { id: 'foundations/colors', label: 'Colors' },
      ],
    },
  ];

  it('keeps a matching leaf and all its ancestor branches', () => {
    const result = filterTree(tree, 'button');
    // Top-level "Components" branch must be present
    expect(result.some((n) => n.id === 'components')).toBe(true);
    // "Foundations" branch must be dropped (no match)
    expect(result.some((n) => n.id === 'foundations')).toBe(false);
    // Controls branch must survive
    const comps = result.find((n) => n.id === 'components');
    expect(comps?.children?.some((n) => n.id === 'components/controls')).toBe(true);
    // Button must survive
    const controls = comps?.children?.find((n) => n.id === 'components/controls');
    expect(controls?.children?.some((n) => n.id === 'components/controls/button')).toBe(true);
    // Input must be dropped (does not match "button")
    expect(controls?.children?.some((n) => n.id === 'components/controls/input')).toBe(false);
  });

  it('returns all nodes when query matches everything', () => {
    const result = filterTree(tree, '');
    // Empty query: fuzzyScore returns 0 (matches) for everything
    expect(result.length).toBe(tree.length);
  });

  it('returns empty array when nothing matches', () => {
    const result = filterTree(tree, 'zzzzzzzzzzzzz');
    expect(result).toEqual([]);
  });

  it('matches ancestor branch by its own label', () => {
    const result = filterTree(tree, 'foundations');
    expect(result.some((n) => n.id === 'foundations')).toBe(true);
    expect(result.some((n) => n.id === 'components')).toBe(false);
  });
});

describe('allBranchIds', () => {
  const tree: TreeItem[] = [
    {
      id: 'components',
      label: 'Components',
      children: [
        {
          id: 'components/controls',
          label: 'Controls',
          children: [
            { id: 'components/controls/button', label: 'Button' },
          ],
        },
      ],
    },
    { id: 'foundations', label: 'Foundations' },
  ];

  it('collects only branch (non-leaf) ids', () => {
    const ids = allBranchIds(tree);
    expect(ids).toContain('components');
    expect(ids).toContain('components/controls');
    // Leaf nodes must not be included
    expect(ids).not.toContain('components/controls/button');
    // Node with no children must not be included
    expect(ids).not.toContain('foundations');
  });

  it('returns empty array for a flat tree with no branches', () => {
    const flat: TreeItem[] = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ];
    expect(allBranchIds(flat)).toEqual([]);
  });
});
