import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';
import { useHashRoute } from './useHashRoute';
import type { TreeNode } from './registry';

// The pure helpers (filterTree / allBranchIds / initialExpanded / reconcileExpanded /
// openBranch) are unit-tested elsewhere; these tests pin the COMPOSER — how Sidebar
// swaps between the user-owned expansion set and the search-derived one, and what a
// row click means in each mode. jsdom has no layout, so everything is asserted via
// DOM structure, ARIA attributes, and the location hash.

const node = (name: string, slug: string, children: TreeNode[] = []): TreeNode => ({ name, slug, children });

// initialExpanded opens every top-level group EXCEPT 'components', so on first
// paint: Sections is open (Hero visible), Components is collapsed (Actions hidden).
const makeTree = (): TreeNode[] => [
  node('Components', 'components', [
    node('Actions', 'components/actions', [node('Button', 'components/actions/button')]),
    node('Inputs', 'components/inputs', [node('Input', 'components/inputs/input')]),
  ]),
  node('Sections', 'sections', [node('Hero', 'sections/hero')]),
];

// Real hash plumbing (same wiring Explorer gives Sidebar) without mounting the
// whole story catalog: route drives activeSlug, onNavigate updates the hash.
function Harness({ tree }: { tree: TreeNode[] }) {
  const { route, navigate } = useHashRoute();
  return <Sidebar tree={tree} route={route} activeSlug={route} onNavigate={navigate} />;
}

const row = (label: string): HTMLElement =>
  screen.getByText(label).closest('[role="treeitem"]') as HTMLElement;

const searchbox = (): HTMLInputElement => screen.getByRole('searchbox') as HTMLInputElement;

describe('Sidebar search / expansion mode-switch', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('typing a query filters the tree and auto-expands every matching branch', async () => {
    const user = userEvent.setup();
    render(<Harness tree={makeTree()} />);

    // Components starts collapsed — Button is not reachable yet.
    expect(screen.queryByText('Button')).toBeNull();

    await user.type(searchbox(), 'button');

    // The match's ancestor branches are force-open (searchExpanded source)…
    expect(row('Components').getAttribute('aria-expanded')).toBe('true');
    expect(row('Actions').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Button')).toBeTruthy();
    // …and non-matching subtrees are pruned entirely.
    expect(screen.queryByText('Sections')).toBeNull();
    expect(screen.queryByText('Inputs')).toBeNull();
  });

  it('freezes expansion while searching and resumes the user set when the query clears', async () => {
    const user = userEvent.setup();
    render(<Harness tree={makeTree()} />);

    // The user opens Components before searching (goes into userExpanded) via
    // the chevron — expansion only, no navigation side-effects in this test.
    fireEvent.click(row('Components').querySelector('.rdz-tree__twist') as HTMLElement);
    expect(screen.getByText('Actions')).toBeTruthy();

    await user.type(searchbox(), 'button');
    expect(row('Actions').getAttribute('aria-expanded')).toBe('true');

    // While searching, expandedIds is controlled with onExpandedChange undefined:
    // a chevron toggle is a no-op — the search expansion cannot be collapsed.
    const chevron = row('Actions').querySelector('.rdz-tree__twist') as HTMLElement;
    fireEvent.click(chevron);
    expect(row('Actions').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Button')).toBeTruthy();

    // Clearing the query swaps back to the untouched user set: the pre-search
    // toggle survived, and Actions (only ever search-expanded) is closed again.
    await user.clear(searchbox());
    expect(row('Components').getAttribute('aria-expanded')).toBe('true');
    expect(row('Actions').getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Button')).toBeNull();
    expect(screen.getByText('Hero')).toBeTruthy(); // Sections default stayed open
  });

  it('selecting a leaf during search navigates (hash) and clears the query', async () => {
    const user = userEvent.setup();
    render(<Harness tree={makeTree()} />);

    await user.type(searchbox(), 'button');
    fireEvent.click(row('Button'));

    expect(window.location.hash).toBe('#/components/actions/button');
    expect(searchbox().value).toBe('');
    // Back out of search mode: the full tree is restored, with the navigated
    // path expanded (reconcileExpanded on the new activeSlug) and selected.
    expect(screen.getByText('Sections')).toBeTruthy();
    expect(row('Button').getAttribute('aria-selected')).toBe('true');
  });

  it('selecting a folder NAME navigates to the group AND opens the branch', async () => {
    const user = userEvent.setup();
    render(<Harness tree={makeTree()} />);

    // Normal mode: name click navigates to the group anchor and expands it.
    expect(screen.queryByText('Actions')).toBeNull();
    fireEvent.click(row('Components'));
    expect(screen.getByText('Actions')).toBeTruthy();
    expect(window.location.hash).toBe('#/components');

    // Search mode: a folder name still navigates and clears the query, and the
    // branch was opened into the user set (visible with the full tree back).
    await user.type(searchbox(), 'input');
    fireEvent.click(row('Inputs'));
    expect(window.location.hash).toBe('#/components/inputs');
    expect(searchbox().value).toBe('');
    expect(row('Inputs').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Input')).toBeTruthy();
  });

  it('the chevron toggles a branch without navigating', () => {
    render(<Harness tree={makeTree()} />);
    const twist = row('Components').querySelector('.rdz-tree__twist') as HTMLElement;
    fireEvent.click(twist);
    expect(screen.getByText('Actions')).toBeTruthy();
    expect(window.location.hash).toBe('');
    fireEvent.click(twist);
    expect(screen.queryByText('Actions')).toBeNull();
  });

  it('renders the empty state instead of the tree for a no-match query', async () => {
    const user = userEvent.setup();
    render(<Harness tree={makeTree()} />);

    await user.type(searchbox(), 'zzzz');

    const empty = screen.getByText('No matches');
    expect(empty.classList.contains('rail__empty')).toBe(true);
    expect(screen.queryByRole('tree')).toBeNull();

    // Recovering the query brings the tree back.
    await user.clear(searchbox());
    expect(screen.getByRole('tree')).toBeTruthy();
  });

  it('collapse-all empties the user set, disables itself, and hides while searching', async () => {
    const user = userEvent.setup();
    render(<Harness tree={makeTree()} />);

    const collapse = screen.getByRole('button', { name: /collapse all/i }) as HTMLButtonElement;
    expect(collapse.disabled).toBe(false); // Sections is open by default

    fireEvent.click(collapse);
    expect(screen.queryByText('Hero')).toBeNull(); // every branch closed
    expect(collapse.disabled).toBe(true); // nothing left to collapse

    // Search expansion is not user expansion — the control disappears entirely.
    await user.type(searchbox(), 'button');
    expect(screen.queryByRole('button', { name: /collapse all/i })).toBeNull();

    await user.clear(searchbox());
    expect((screen.getByRole('button', { name: /collapse all/i }) as HTMLButtonElement).disabled).toBe(true);
  });
});
