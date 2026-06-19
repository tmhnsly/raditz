import { useEffect, useMemo, useState } from 'react';
import { Tree, type TreeNode as TreeItem } from '../components/navigation/Tree';
import { Search } from '../components/forms/Search';
import { fuzzyScore } from '../components/internal';
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

/** Prune the tree to nodes that fuzzy-match the query (keeping ancestors of any match). */
function filterTree(nodes: TreeItem[], query: string): TreeItem[] {
  const out: TreeItem[] = [];
  for (const n of nodes) {
    const kids = n.children ? filterTree(n.children, query) : [];
    const selfMatch = fuzzyScore(String(n.label), query) !== null;
    if (selfMatch || kids.length) out.push({ ...n, children: kids.length ? kids : n.children });
  }
  return out;
}

/** Ids of every branch (folder) node — used to fully expand search results. */
function allBranchIds(nodes: TreeItem[], acc: string[] = []): string[] {
  for (const n of nodes) {
    if (n.children?.length) { acc.push(n.id); allBranchIds(n.children, acc); }
  }
  return acc;
}

export function Sidebar({
  tree,
  route,
  activeSlug,
  onNavigate,
}: {
  tree: TreeNode[];
  route: string;
  activeSlug: string;
  onNavigate: (slug: string) => void;
}) {
  const allItems = useMemo(() => toItems(tree), [tree]);
  const [query, setQuery] = useState('');
  const searching = query.trim().length > 0;
  const filtered = useMemo(() => (searching ? filterTree(allItems, query.trim()) : allItems), [searching, query, allItems]);

  // Compositions-first groups start open; Components starts collapsed. User
  // toggles persist; scroll-spy expands the branch you're currently viewing.
  const [userExpanded, setUserExpanded] = useState<string[]>(() => {
    const open = new Set<string>(tree.filter((n) => n.slug !== 'components').map((n) => n.slug));
    ancestorsOf(route).forEach((s) => open.add(s));
    return [...open];
  });
  useEffect(() => {
    const anc = ancestorsOf(activeSlug);
    if (!anc.length) return;
    setUserExpanded((prev) => {
      const s = new Set(prev);
      anc.forEach((a) => s.add(a));
      return [...s];
    });
  }, [activeSlug]);

  const searchExpanded = useMemo(() => (searching ? allBranchIds(filtered) : []), [searching, filtered]);

  return (
    <div className="rail__nav">
      <Search
        className="rail__search"
        size="sm"
        placeholder="Search…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="rail__tools">
        <button
          type="button"
          className={'tree__home' + (route === '' ? ' tree__home--active' : '')}
          aria-current={route === '' ? 'page' : undefined}
          onClick={() => onNavigate('')}
        >
          Overview
        </button>
        {!searching && (
          <button
            type="button"
            className="rail__collapse"
            onClick={() => setUserExpanded([])}
            disabled={userExpanded.length === 0}
            title="Collapse all groups"
          >
            Collapse all
          </button>
        )}
      </div>
      {searching && filtered.length === 0 ? (
        <p className="rail__empty">No matches</p>
      ) : (
        <Tree
          aria-label="Showcase navigation"
          items={filtered}
          selectedId={activeSlug || route || undefined}
          onSelect={(id) => { onNavigate(id); setQuery(''); }}
          expandedIds={searching ? searchExpanded : userExpanded}
          onExpandedChange={searching ? undefined : setUserExpanded}
          toggleOnRowClick={false}
        />
      )}
    </div>
  );
}
