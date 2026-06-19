// Pure paging math shared by Pagination and DataTable — one tested source of
// truth for "how many pages", "which page numbers to show", and (for DataTable)
// "which rows are on this page" and "what range am I viewing".

/** Number of pages for `total` items at `pageSize` (>=1; 1 when pageSize<=0). */
export function pageCount(total: number, pageSize: number): number {
  return pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;
}

/** The slice of `items` on a 0-based `page`. pageSize<=0 → all items (same ref). */
export function pageSlice<T>(items: T[], page: number, pageSize: number): T[] {
  if (pageSize <= 0) return items;
  const start = page * pageSize;
  return items.slice(start, start + pageSize);
}

/** 1-based human range for a 0-based `page` — the "{from}–{to} of {total}" label. */
export function pageRange(page: number, pageSize: number, total: number): { from: number; to: number; total: number } {
  if (total === 0) return { from: 0, to: 0, total: 0 };
  return { from: page * pageSize + 1, to: Math.min((page + 1) * pageSize, total), total };
}

export type PageEntry = number | '…';

/**
 * Fixed-width page list so a pager never changes width as you page. For large
 * totals it always returns `siblings*2 + 5` slots: near an end the window
 * expands to fill (no single-page ellipsis); in the middle both ends ellipsise.
 * `page` and `total` are 1-based page numbers.
 */
export function buildPages(page: number, total: number, siblings = 1): PageEntry[] {
  const out: PageEntry[] = [];
  const range = (a: number, b: number): void => { for (let i = a; i <= b; i++) out.push(i); };
  const slots = siblings * 2 + 5;
  if (total <= slots) { range(1, total); return out; }
  const showLeftDots = page > siblings + 3;
  const showRightDots = page < total - (siblings + 2);
  if (!showLeftDots && showRightDots) {
    range(1, siblings * 2 + 3);
    out.push('…', total);
  } else if (showLeftDots && !showRightDots) {
    out.push(1, '…');
    range(total - (siblings * 2 + 2), total);
  } else {
    out.push(1, '…');
    range(page - siblings, page + siblings);
    out.push('…', total);
  }
  return out;
}
