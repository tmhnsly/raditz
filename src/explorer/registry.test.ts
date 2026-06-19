/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import { entries, buildTree, entriesUnder, findNode } from './registry';

describe('story registry', () => {
  it('discovers stories from every area of the library', () => {
    const titles = entries.map((e) => e.title);
    expect(titles.some((t) => t.startsWith('Foundations/'))).toBe(true);
    expect(titles.some((t) => t.startsWith('Components/'))).toBe(true);
    expect(titles.some((t) => t.startsWith('Sections/'))).toBe(true);
    expect(titles.some((t) => t.startsWith('Pages/'))).toBe(true);
  });

  it('derives kebab slugs and at least one variant per entry', () => {
    const button = entries.find((e) => e.title === 'Components/Controls/Button');
    expect(button).toBeDefined();
    expect(button!.slug).toBe('components/controls/button');
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
    const controls = entriesUnder('components/controls');
    expect(controls.length).toBeGreaterThan(1);
    expect(controls.every((e) => e.slug.startsWith('components/controls'))).toBe(true);
  });

  it('findNode locates branches and leaves by slug', () => {
    const tree = buildTree();
    expect(findNode(tree, 'components')?.name).toBe('Components');
    expect(findNode(tree, 'components/controls/button')?.entry?.title).toBe(
      'Components/Controls/Button',
    );
  });
});
