import { useEffect, useState } from 'react';

/**
 * Foundations story tooling — resolve a list of length-valued CSS custom
 * properties (spacing, radius, incl. `calc()`-based ones) to their computed px.
 *
 * Needed because `getComputedStyle(root).getPropertyValue('--radius-md')` returns
 * the *declared* value (e.g. `calc(0.25rem * var(--radius-factor))`), not the
 * resolved length. We bounce each token through a real `width` on an off-screen
 * probe so the engine resolves it for us. Client-only (stories run in a browser).
 */
export function useResolvedLengths(tokens: readonly string[]): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    document.body.appendChild(probe);
    const next: Record<string, string> = {};
    for (const t of tokens) {
      probe.style.width = `var(--${t})`;
      next[t] = getComputedStyle(probe).width;
    }
    probe.remove();
    setValues(next);
  }, [tokens]);
  return values;
}
