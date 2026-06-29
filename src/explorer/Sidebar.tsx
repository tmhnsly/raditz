import { useEffect, useMemo, useState } from 'react';
import { GiMoonOrbit } from 'react-icons/gi';
import { Tree, type TreeNode as TreeItem } from '../components/navigation/Tree';
import { Search } from '../components/inputs/Search';
import type { TreeNode } from './registry';
import { ancestorsOf, filterTree, allBranchIds } from './registry';
import { initialExpanded, reconcileExpanded, openBranch } from './expansion';

// A few top-level groups read better with a fuller label than their story prefix.
const LABEL_OVERRIDE: Record<string, string> = {
  demos: 'Demos / design ideas',
};

// As scroll-spy moves the active section, collapse branches that aren't on the
// active path ("close behind" you) so the tree stays tidy. Flip to false to keep
// every branch you've opened expanded instead.
const AUTO_COLLAPSE = true;

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
  const [userExpanded, setUserExpanded] = useState<string[]>(() =>
    initialExpanded(tree.map((n) => n.slug), ancestorsOf(route), 'components'),
  );
  useEffect(() => {
    setUserExpanded((prev) => reconcileExpanded(prev, ancestorsOf(activeSlug), AUTO_COLLAPSE));
  }, [activeSlug]);

  const searchExpanded = useMemo(() => (searching ? allBranchIds(filtered) : []), [searching, filtered]);

  return (
    <div className="rail__nav">
      <div className="rail__head">
        <div className="rail__brand rail__brand--desktop"><span className="mark"><GiMoonOrbit /></span>Raditz</div>
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
      </div>
      <div className="rail__list">
      {searching && filtered.length === 0 ? (
        <p className="rail__empty">No matches</p>
      ) : (
        <Tree
          aria-label="Showcase navigation"
          items={filtered}
          selectedId={activeSlug || route || undefined}
          onSelect={(id, node) => {
            // A folder/group row OPENS the folder (the chevron toggles it closed)
            // and does NOT navigate — otherwise we'd scroll to the group heading and
            // the scroll-spy would snap the selection to the first leaf under it
            // (the "wrong section"). A leaf row navigates.
            if (node.children?.length) {
              setUserExpanded((prev) => openBranch(prev, id));
            } else {
              onNavigate(id);
              setQuery('');
            }
          }}
          expandedIds={searching ? searchExpanded : userExpanded}
          onExpandedChange={searching ? undefined : setUserExpanded}
          toggleOnRowClick={false}
        />
      )}
      </div>
    </div>
  );
}
