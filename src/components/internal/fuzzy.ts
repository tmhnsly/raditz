// Lightweight fuzzy matcher — subsequence match with scoring. Used wherever
// Raditz offers search (Combobox, CommandPalette, the explorer tree) so
// filtering behaves consistently. No dependencies.

const BOUNDARY = /[\s\-_/.]/;

/**
 * Score how well `query` fuzzy-matches `text`. Returns `null` when `query` is
 * not a subsequence of `text`. Higher is better. An empty query scores 0
 * (matches anything). Rewards: contiguous runs, and matches at word boundaries.
 */
export function fuzzyScore(text: string, query: string): number | null {
  if (!query) return 0;
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  let ti = 0;
  let score = 0;
  let streak = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const idx = t.indexOf(q[qi], ti);
    if (idx === -1) return null;
    let bonus = 1;
    if (idx === ti) { streak += 1; bonus += streak * 2; } else { streak = 0; }
    if (idx === 0 || BOUNDARY.test(t[idx - 1])) bonus += 3;
    score += bonus;
    ti = idx + 1;
  }
  // Slight preference for shorter text (denser match).
  return score - t.length * 0.01;
}

/**
 * Filter + rank `items` by how well they fuzzy-match `query` (best first).
 * An empty/whitespace query returns the items unchanged. `key` extracts the
 * searchable string from each item.
 */
export function fuzzyFilter<T>(items: T[], query: string, key: (item: T) => string): T[] {
  if (!query.trim()) return items;
  return items
    .map((item) => ({ item, score: fuzzyScore(key(item), query) }))
    .filter((r): r is { item: T; score: number } => r.score !== null)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}
