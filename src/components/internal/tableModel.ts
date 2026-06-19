// Table-model — the pure logic behind a sortable, selectable table: the sort
// comparator + header-click cycle, and the row-selection algebra. The component
// (DataTable) owns the React state and the cell rendering; this module owns the
// rules, so the null-ordering, type-aware comparison, and select-all-on-page
// algebra are unit-tested instead of hiding inside JSX. Paging math lives in the
// Page-model (pageModel.ts), which DataTable composes alongside this.

export type SortDir = 'asc' | 'desc';
export interface Sort {
  key: string;
  dir: SortDir;
}

/** Compare two non-nullish cell values: numbers numerically, everything else by
 *  locale string. Split out so the null handling can stay direction-independent. */
function compareNonNull(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

/**
 * Ascending comparator with nullish values sorted last and type-aware ordering
 * (numeric for numbers, locale for strings). This is the ascending order; for
 * descending, {@link sortRows} negates only the non-null comparison so nullish
 * values stay at the end in both directions.
 */
export function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return compareNonNull(a, b);
}

/**
 * Sort a copy of `rows` by `sort`, reading each cell via `getValue`. Returns the
 * original array (no copy) when `sort` is null. Nullish values sort last in both
 * directions; non-null values reverse for descending.
 */
export function sortRows<Row>(rows: Row[], sort: Sort | null, getValue: (row: Row, key: string) => unknown): Row[] {
  if (!sort) return rows;
  const dir = sort.dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = getValue(a, sort.key);
    const bv = getValue(b, sort.key);
    if (av == null && bv == null) return 0;
    if (av == null) return 1; // nullish last, regardless of direction
    if (bv == null) return -1;
    return dir * compareNonNull(av, bv);
  });
}

/** The header-click cycle: a fresh column starts ascending; the active column
 *  goes asc → desc → off. */
export function nextSort(current: Sort | null, key: string): Sort | null {
  if (!current || current.key !== key) return { key, dir: 'asc' };
  if (current.dir === 'asc') return { key, dir: 'desc' };
  return null;
}

/** Toggle one key in a selection: add if absent, remove if present. */
export function toggleSelected<K>(selected: K[], key: K): K[] {
  return selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
}

/**
 * Toggle a whole page's keys: if every page key is already selected, remove them
 * all; otherwise add the missing ones — preserving off-page selection, no dups.
 */
export function togglePage<K>(selected: K[], pageKeys: K[]): K[] {
  const all = pageKeys.length > 0 && pageKeys.every((k) => selected.includes(k));
  if (all) return selected.filter((k) => !pageKeys.includes(k));
  return [...new Set([...selected, ...pageKeys])];
}

/** Tri-state of a page's selection — drives the header checkbox (all = checked,
 *  some = indeterminate, none = unchecked). An empty page is 'none'. */
export function pageSelectionState<K>(selected: K[], pageKeys: K[]): 'all' | 'some' | 'none' {
  if (pageKeys.length === 0) return 'none';
  const count = pageKeys.filter((k) => selected.includes(k)).length;
  if (count === 0) return 'none';
  return count === pageKeys.length ? 'all' : 'some';
}
