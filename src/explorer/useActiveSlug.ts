import { useCallback, useEffect, useState } from 'react';
import { navigationIntent, observed, type ActiveState } from './activeSlug';

/** Thin React wiring over the pure active-slug machine (activeSlug.ts): every
 * route change (including the initial deep link) is a navigation intent; the
 * scroll spy feeds observations through `observe`. All the arbitration lives in
 * the machine — this hook only supplies the clock and the state cell. */
export function useActiveSlug(route: string): { activeSlug: string; observe: (slug: string) => void } {
  const [state, setState] = useState<ActiveState>(() => navigationIntent(route, Date.now()));

  useEffect(() => {
    setState(navigationIntent(route, Date.now()));
  }, [route]);

  // Stable identity so the spy effect subscribes once. `observed` returns the
  // same reference when nothing changes, so per-frame calls don't re-render.
  const observe = useCallback((slug: string) => {
    setState((prev) => observed(prev, slug, Date.now()));
  }, []);

  return { activeSlug: state.slug, observe };
}
