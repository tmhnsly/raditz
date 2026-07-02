import { describe, it, expect } from 'vitest';
import { pageRows } from './pageRows';
import type { Entry, TreeNode } from './registry';

// pageRows is the ordering contract for the whole long page: the flat, pre-order
// sequence of group headings + entry blocks that StoryView renders and the
// scroll-spy / hash navigation anchor into.

const entry = (slug: string): Entry => ({
  slug,
  segments: slug.split('/').map((s) => s[0].toUpperCase() + s.slice(1)),
  title: slug,
  variants: [{ id: 'default', name: 'Default', Component: () => null }],
});

const leaf = (name: string, slug: string): TreeNode => ({ name, slug, children: [], entry: entry(slug) });
const group = (name: string, slug: string, children: TreeNode[]): TreeNode => ({ name, slug, children });

const tree: TreeNode[] = [
  group('Components', 'components', [
    group('Actions', 'components/actions', [
      leaf('Button', 'components/actions/button'),
      leaf('Toggle', 'components/actions/toggle'),
    ]),
    group('Display', 'components/display', [leaf('Badge', 'components/display/badge')]),
  ]),
  group('Sections', 'sections', [leaf('Hero', 'sections/hero')]),
];

describe('pageRows', () => {
  it('flattens the tree pre-order: each group heading precedes its subtree', () => {
    expect(pageRows(tree).map((r) => r.slug)).toEqual([
      'components',
      'components/actions',
      'components/actions/button',
      'components/actions/toggle',
      'components/display',
      'components/display/badge',
      'sections',
      'sections/hero',
    ]);
  });

  it('tags group headings with their depth and entries with their Entry', () => {
    const rows = pageRows(tree);
    expect(rows[0]).toEqual({ kind: 'group', slug: 'components', name: 'Components', level: 0 });
    expect(rows[1]).toEqual({ kind: 'group', slug: 'components/actions', name: 'Actions', level: 1 });
    const button = rows[2];
    expect(button.kind).toBe('entry');
    if (button.kind === 'entry') expect(button.entry.slug).toBe('components/actions/button');
  });

  it('preserves sibling order as given (the registry sorts; pageRows must not)', () => {
    const reversed = [tree[1], tree[0]];
    expect(pageRows(reversed)[0].slug).toBe('sections');
  });

  it('treats a node with an entry as a leaf and does not recurse below it', () => {
    const weird: TreeNode[] = [{ ...leaf('Button', 'components/actions/button'), children: [leaf('Ghost', 'x/ghost')] }];
    expect(pageRows(weird).map((r) => r.slug)).toEqual(['components/actions/button']);
  });

  it('returns [] for an empty tree', () => {
    expect(pageRows([])).toEqual([]);
  });
});
