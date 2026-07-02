'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, KeyboardEvent, ReactElement, ReactNode } from 'react';
import { cx, useControllableState, KEYS } from '../../internal';

export interface TreeNode {
  /** Stable, unique identifier. */
  id: string;
  /** Row label. */
  label: ReactNode;
  /** Optional trailing slot (e.g. a count badge). */
  meta?: ReactNode;
  /** Child nodes — presence makes this row a collapsible "folder". */
  children?: TreeNode[];
  /** Render disabled / non-interactive. */
  disabled?: boolean;
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** The node forest to render. */
  items: TreeNode[];
  /** Controlled selected id. */
  selectedId?: string;
  /** Initial selected id (uncontrolled). */
  defaultSelectedId?: string;
  /** Fires when a row is activated. */
  onSelect?: (id: string, node: TreeNode) => void;
  /** Controlled set of expanded ids. */
  expandedIds?: string[];
  /** Initially expanded ids (uncontrolled). */
  defaultExpandedIds?: string[];
  /** Fires when the expanded set changes. */
  onExpandedChange?: (ids: string[]) => void;
  /** Opt-in file-browser behaviour: clicking a folder row ALSO toggles it.
   * By default the row (name) only selects — `onSelect` fires for leaves and
   * branches alike — and expansion is the chevron's (and ←/→'s) job. @default false */
  toggleOnRowClick?: boolean;
}

type Flat = { node: TreeNode; level: number; hasChildren: boolean; expanded: boolean; parentId?: string };

function findNodeById(items: TreeNode[], id: string): TreeNode | undefined {
  for (const n of items) {
    if (n.id === id) return n;
    if (n.children) { const f = findNodeById(n.children, id); if (f) return f; }
  }
  return undefined;
}

function descendantIds(items: TreeNode[], acc: string[] = []): string[] {
  for (const n of items) { acc.push(n.id); if (n.children) descendantIds(n.children, acc); }
  return acc;
}

function flatten(items: TreeNode[], expanded: Set<string>, level = 1, parentId?: string, out: Flat[] = []): Flat[] {
  for (const node of items) {
    const hasChildren = !!node.children?.length;
    const isExpanded = hasChildren && expanded.has(node.id);
    out.push({ node, level, hasChildren, expanded: isExpanded, parentId });
    if (isExpanded) flatten(node.children!, expanded, level + 1, node.id, out);
  }
  return out;
}

const firstEnabledId = (items: TreeNode[]): string | undefined =>
  items.find((n) => !n.disabled)?.id ?? items[0]?.id;

/**
 * Tree — an accessible tree view (WAI-ARIA `tree` pattern) with a split row:
 * clicking a row's NAME selects it (`onSelect` fires for leaves and branches),
 * while the chevron toggles a branch open/closed without selecting. Selection
 * and expansion are each controllable or uncontrolled. Full keyboard support:
 * Up/Down move between visible rows, Right/Left expand/collapse (or step
 * in/out), Enter/Space select, Home/End jump to ends. Roving tabindex keeps a
 * single tab stop. `toggleOnRowClick` opts back into file-browser behaviour
 * (row click also toggles).
 */
export function Tree({
  items,
  selectedId,
  defaultSelectedId,
  onSelect,
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
  toggleOnRowClick = false,
  className,
  ...rest
}: TreeProps): ReactElement {
  const byId = useMemo(() => {
    const map = new Map<string, TreeNode>();
    const walk = (nodes: TreeNode[]) => nodes.forEach((n) => { map.set(n.id, n); if (n.children) walk(n.children); });
    walk(items);
    return map;
  }, [items]);

  const [selected, setSelected] = useControllableState<string | undefined>({
    value: selectedId,
    defaultValue: defaultSelectedId,
    onChange: onSelect ? (id) => { if (id != null) onSelect(id, byId.get(id)!); } : undefined,
  });
  const [expandedArr, setExpanded] = useControllableState<string[]>({
    value: expandedIds,
    defaultValue: defaultExpandedIds ?? [],
    onChange: onExpandedChange,
  });
  const expanded = useMemo(() => new Set(expandedArr ?? []), [expandedArr]);

  const visible = useMemo(() => flatten(items, expanded), [items, expanded]);
  const [activeId, setActiveId] = useState<string | undefined>(() => selected ?? firstEnabledId(items));
  const rowRefs = useRef(new Map<string, HTMLDivElement>());

  const focusRow = (id: string) => {
    setActiveId(id);
    rowRefs.current.get(id)?.focus();
  };

  // Keep the selected row visible inside its own scroll container (e.g. a sidebar
  // rail) when selection changes from outside — scroll-spy following the page —
  // WITHOUT scrolling the window/page.
  useEffect(() => {
    if (selected == null) return;
    const row = rowRefs.current.get(selected);
    if (!row) return;
    let s: HTMLElement | null = row.parentElement;
    while (s) {
      const oy = getComputedStyle(s).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && s.scrollHeight > s.clientHeight) break;
      s = s.parentElement;
    }
    if (!s) return;
    const r = row.getBoundingClientRect();
    const c = s.getBoundingClientRect();
    if (r.top < c.top) s.scrollTop -= (c.top - r.top) + 16;
    else if (r.bottom > c.bottom) s.scrollTop += (r.bottom - c.bottom) + 16;
  }, [selected]);

  const toggle = (id: string, open?: boolean) => {
    const next = new Set(expanded);
    const willOpen = open ?? !next.has(id);
    if (willOpen) {
      next.add(id);
    } else {
      // collapsing a parent collapses its whole subtree, so re-opening it doesn't
      // restore a deep half-open state.
      next.delete(id);
      const node = findNodeById(items, id);
      if (node?.children) descendantIds(node.children).forEach((d) => next.delete(d));
    }
    setExpanded([...next]);
  };

  // Split interaction: activating a row (click on the name, Enter/Space)
  // SELECTS it — branches included — while expansion belongs to the chevron
  // and ArrowLeft/ArrowRight. `toggleOnRowClick` opts back into file-browser
  // behaviour where activating a folder also toggles it.
  const activate = (f: Flat) => {
    if (f.node.disabled) return;
    setSelected(f.node.id);
    if (toggleOnRowClick && f.hasChildren) toggle(f.node.id);
    focusRow(f.node.id);
  };

  const indexOfActive = () => visible.findIndex((f) => f.node.id === activeId);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = indexOfActive();
    if (i === -1) return;
    const f = visible[i];
    switch (e.key) {
      case KEYS.ArrowDown:
        if (i < visible.length - 1) { e.preventDefault(); focusRow(visible[i + 1].node.id); }
        break;
      case KEYS.ArrowUp:
        if (i > 0) { e.preventDefault(); focusRow(visible[i - 1].node.id); }
        break;
      case KEYS.ArrowRight:
        e.preventDefault();
        if (f.hasChildren && !f.expanded) toggle(f.node.id, true);
        else if (f.hasChildren && f.expanded && i < visible.length - 1) focusRow(visible[i + 1].node.id);
        break;
      case KEYS.ArrowLeft:
        e.preventDefault();
        if (f.hasChildren && f.expanded) toggle(f.node.id, false);
        else if (f.parentId) focusRow(f.parentId);
        break;
      case KEYS.Home:
        e.preventDefault();
        focusRow(visible[0].node.id);
        break;
      case KEYS.End:
        e.preventDefault();
        focusRow(visible[visible.length - 1].node.id);
        break;
      case KEYS.Enter:
      case KEYS.Space:
        e.preventDefault();
        activate(f);
        break;
    }
  };

  const renderNodes = (nodes: TreeNode[], level: number): ReactElement[] =>
    nodes.map((node) => {
      const hasChildren = !!node.children?.length;
      const isExpanded = hasChildren && expanded.has(node.id);
      const isSelected = selected === node.id;
      const isActive = activeId === node.id;
      return (
        <div className="rdz-tree__node" key={node.id} role="none">
          <div
            ref={(el) => { if (el) rowRefs.current.set(node.id, el); else rowRefs.current.delete(node.id); }}
            role="treeitem"
            aria-level={level}
            aria-selected={isSelected}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-disabled={node.disabled || undefined}
            tabIndex={isActive ? 0 : -1}
            className={cx(
              'rdz-tree__item',
              hasChildren && 'rdz-tree__item--branch',
              isSelected && 'rdz-tree__item--selected',
              node.disabled && 'rdz-tree__item--disabled',
            )}
            style={{ '--tree-level': level } as CSSProperties}
            onClick={() => activate({ node, level, hasChildren, expanded: isExpanded })}
            onFocus={() => setActiveId(node.id)}
          >
            {/* Dedicated toggle target. Kept PRESENTATIONAL (aria-hidden, no
                button) on purpose: the treeitem itself carries aria-expanded
                and ←/→ already toggle from the keyboard, so a nested button
                would be a redundant announcement and a nested-interactive
                violation inside the focusable treeitem. */}
            <span
              className="rdz-tree__twist"
              aria-hidden
              onClick={hasChildren ? (e) => { e.stopPropagation(); if (!node.disabled) toggle(node.id); } : undefined}
            >
              {hasChildren && (
                <svg viewBox="0 0 16 16" width="1em" height="1em" className={cx('rdz-tree__chevron', isExpanded && 'is-open')}>
                  <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="rdz-tree__label">{node.label}</span>
            {node.meta != null && <span className="rdz-tree__meta">{node.meta}</span>}
          </div>
          {hasChildren && isExpanded && (
            <div role="group" className="rdz-tree__group">
              {renderNodes(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });

  return (
    <div role="tree" className={cx('rdz-tree', className)} onKeyDown={onKeyDown} {...rest}>
      {renderNodes(items, 1)}
    </div>
  );
}
