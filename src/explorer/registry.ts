/// <reference types="vite/client" />
// Story registry — the single source of truth for the showcase. Discovers every
// *.stories.tsx at build time via import.meta.glob and derives a navigable tree
// from each story's `meta.title` path (e.g. "Components/Controls/Button").
//
// Stories are rendered with a small inline renderer (NOT Storybook's
// composeStories) so the Storybook runtime stays out of the public app bundle.
// Every story here is plain CSF3: a `meta` default export plus named StoryObj
// exports that are either `{}` (render meta.component with args) or `{ render }`.
import { createElement } from 'react';
import { fuzzyScore } from '../components/internal';
// The folder→title→slug helpers come from the shared taxonomy grammar (scripts/),
// so the showroom tree is built from the SAME rule the release gate enforces.
import { kebab, humanize, titleSegments, slugForTitle } from '../../scripts/taxonomy.mjs';
import type { TreeNode as TreeItem } from '../components/navigation/Tree';
import type { ComponentType, ReactElement } from 'react';

type StoryObj = {
  name?: string;
  storyName?: string;
  args?: Record<string, unknown>;
  render?: (args: Record<string, unknown>, ctx: { args: Record<string, unknown> }) => ReactElement;
};
type StoryFn = ((args: Record<string, unknown>, ctx: { args: Record<string, unknown> }) => ReactElement) & {
  args?: Record<string, unknown>;
  storyName?: string;
};
type Meta = {
  title?: string;
  component?: ComponentType<Record<string, unknown>>;
  args?: Record<string, unknown>;
  parameters?: { docs?: { description?: { component?: string } }; layout?: string };
};
type StoryModule = { default?: Meta } & Record<string, StoryObj | StoryFn | Meta | undefined>;

export type Variant = { id: string; name: string; Component: ComponentType };

export type Entry = {
  slug: string; // full kebab path, e.g. "components/actions/button"
  segments: string[]; // ["Components", "Controls", "Button"]
  title: string; // raw meta.title
  description?: string;
  fullscreen?: boolean;
  variants: Variant[];
};

export type TreeNode = {
  name: string; // segment label, e.g. "Controls"
  slug: string; // prefix slug, e.g. "components/controls"
  children: TreeNode[];
  entry?: Entry; // present only on leaves
};

// Build a real component per story so render functions (which may use hooks) run
// in their own render context, exactly as Storybook composes them.
function toComponent(meta: Meta, story: StoryObj | StoryFn): ComponentType {
  const Story = () => {
    const args = { ...(meta.args ?? {}), ...(story.args ?? {}) };
    if (typeof story === 'function') return story(args, { args });
    if (story.render) return story.render(args, { args });
    if (meta.component) return createElement(meta.component, args);
    return null;
  };
  return Story;
}

const modules = import.meta.glob('../**/*.stories.@(ts|tsx)', { eager: true }) as Record<string, StoryModule>;

export const entries: Entry[] = Object.values(modules)
  .filter((m) => m?.default?.title)
  .map((m) => {
    const meta = m.default!;
    const title = String(meta.title);
    const segments = titleSegments(title);
    const variants: Variant[] = Object.entries(m)
      .filter(([key, val]) => key !== 'default' && val != null)
      .map(([id, val]) => {
        const story = val as StoryObj | StoryFn;
        return {
          id,
          name: (story as StoryObj).name ?? (story as StoryFn).storyName ?? humanize(id),
          Component: toComponent(meta, story),
        };
      });
    return {
      slug: slugForTitle(title),
      segments,
      title,
      description: meta.parameters?.docs?.description?.component,
      fullscreen: meta.parameters?.layout === 'fullscreen',
      variants,
    };
  })
  .filter((e) => e.variants.length > 0)
  .sort((a, b) => a.slug.localeCompare(b.slug));

// Smallest → largest (atomic order): design tokens, then components, then the
// compositions built from them (sections → pages), with freeform demos last.
// Anything else falls back to alphabetical.
export const TOP_ORDER = ['Foundations', 'Components', 'Sections', 'Pages', 'Demos'];

function orderSort(nodes: TreeNode[]): void {
  nodes.sort((a, b) => {
    const ia = TOP_ORDER.indexOf(a.name);
    const ib = TOP_ORDER.indexOf(b.name);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
  nodes.forEach((n) => orderSort(n.children));
}

export function buildTree(list: Entry[] = entries): TreeNode[] {
  const root: TreeNode = { name: '', slug: '', children: [] };
  for (const e of list) {
    let node = root;
    e.segments.forEach((seg, i) => {
      const slug = e.segments.slice(0, i + 1).map(kebab).join('/');
      let child = node.children.find((c) => c.name === seg);
      if (!child) {
        child = { name: seg, slug, children: [] };
        node.children.push(child);
      }
      node = child;
    });
    node.entry = e; // the final segment is the leaf for this story file
  }
  orderSort(root.children);
  return root.children;
}

/** All entries at or below a slug. Empty slug → everything. */
export const entriesUnder = (slug: string): Entry[] =>
  slug === '' ? entries : entries.filter((e) => e.slug === slug || e.slug.startsWith(slug + '/'));

export function findNode(nodes: TreeNode[], slug: string): TreeNode | undefined {
  for (const n of nodes) {
    if (n.slug === slug) return n;
    const found = findNode(n.children, slug);
    if (found) return found;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Sidebar tree-navigation helpers (pure functions, moved here for testability)
// ---------------------------------------------------------------------------

/** Slugs of every ancestor (and self) of a route, so deep links open expanded. */
export function ancestorsOf(slug: string): string[] {
  if (!slug) return [];
  const parts = slug.split('/');
  return parts.map((_, i) => parts.slice(0, i + 1).join('/'));
}

/** Prune the tree to nodes that fuzzy-match the query (keeping ancestors of any match). */
export function filterTree(nodes: TreeItem[], query: string): TreeItem[] {
  const out: TreeItem[] = [];
  for (const n of nodes) {
    const kids = n.children ? filterTree(n.children, query) : [];
    const selfMatch = fuzzyScore(String(n.label), query) !== null;
    if (selfMatch || kids.length) out.push({ ...n, children: kids.length ? kids : n.children });
  }
  return out;
}

/** Ids of every branch (folder) node — used to fully expand search results. */
export function allBranchIds(nodes: TreeItem[], acc: string[] = []): string[] {
  for (const n of nodes) {
    if (n.children?.length) { acc.push(n.id); allBranchIds(n.children, acc); }
  }
  return acc;
}
