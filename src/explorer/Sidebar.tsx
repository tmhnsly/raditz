import { useMemo, useState } from 'react';
import { Tree, type TreeNode as TreeItem } from '../components/navigation/Tree';
import type { TreeNode } from './registry';

// A few top-level groups read better with a fuller label than their story prefix.
const LABEL_OVERRIDE: Record<string, string> = {
  demos: 'Demos / design ideas',
};

// Slugs of every ancestor of a route, so deep links open expanded to the target.
function ancestorsOf(slug: string): string[] {
  if (!slug) return [];
  const parts = slug.split('/');
  return parts.map((_, i) => parts.slice(0, i + 1).join('/'));
}

function toItems(nodes: TreeNode[]): TreeItem[] {
  return nodes.map((n) => ({
    id: n.slug,
    label: LABEL_OVERRIDE[n.slug] ?? n.name,
    meta: n.entry ? n.entry.variants.length : undefined,
    children: n.children.length ? toItems(n.children) : undefined,
  }));
}

export function Sidebar({
  tree,
  route,
  onNavigate,
}: {
  tree: TreeNode[];
  route: string;
  onNavigate: (slug: string) => void;
}) {
  const items = useMemo(() => toItems(tree), [tree]);

  // Compositions-first groups start open; the Components catalog starts collapsed.
  // Captured once at mount; in-app clicks expand naturally (file-browser style).
  const [defaultExpandedIds] = useState(() => {
    const open = new Set<string>(tree.filter((n) => n.slug !== 'components').map((n) => n.slug));
    ancestorsOf(route).forEach((s) => open.add(s));
    return [...open];
  });

  return (
    <div className="rail__nav">
      <button
        type="button"
        className={'tree__home' + (route === '' ? ' tree__home--active' : '')}
        aria-current={route === '' ? 'page' : undefined}
        onClick={() => onNavigate('')}
      >
        Overview
      </button>
      <Tree
        aria-label="Showcase navigation"
        items={items}
        selectedId={route || undefined}
        onSelect={(id) => onNavigate(id)}
        defaultExpandedIds={defaultExpandedIds}
      />
    </div>
  );
}
