// Active-slug decision core — the ONE place that decides "what's active and why".
// Two things want to write the active slug and they used to race: a NAVIGATION
// INTENT (hash route change → Explorer's `go()` jumps the page with scrollIntoView)
// and a SCROLL OBSERVATION (the spy's per-frame "deepest section past the
// activation line"). The programmatic jump itself fires scroll events, so an
// observation computed mid-jump — or off a short section whose successor also
// crosses the line — could overwrite the freshly navigated slug and the tree
// highlight / breadcrumb would flicker or land wrong.
//
// The rule (simplest that kills the race, given `go()` jumps instantly with
// behavior 'auto'):
//
//   After a navigation intent, the target holds. An observation only wins again
//   when it FULFILS the intent (it observes the target itself, or — for a group
//   target, which is never spy-visible — an entry under it), or when the settle
//   window has passed, which is how "the user actually scrolled away" manifests:
//   the jump's own scroll events all land within a frame or two, so any
//   observation arriving after the window is a real scroll.
//
// Pure and clock-free: callers pass `now`, so every branch is unit-testable.

export interface ActiveState {
  /** The slug driving the tree highlight + breadcrumb ('' = Overview). */
  slug: string;
  /** A pending navigation, while observations must not overwrite the target. */
  intent: { target: string; until: number } | null;
}

/** How long a navigation's target holds against non-fulfilling observations.
 * Generous vs the instant jump's one-or-two scroll frames, short vs a human
 * deciding to scroll somewhere else. */
export const SETTLE_MS = 500;

/** A navigation happened (route change / initial deep link): the target becomes
 * active immediately and holds until fulfilled or settled. */
export function navigationIntent(target: string, now: number): ActiveState {
  return { slug: target, intent: { target, until: now + SETTLE_MS } };
}

/** Does an observed slug fulfil an intent's target? The target itself, or — when
 * the target is a group (group headings are anchors but not spy-visible) — any
 * entry under it. Overview ('') is only fulfilled by observing Overview. */
export function fulfilsIntent(observedSlug: string, target: string): boolean {
  return observedSlug === target || (target !== '' && observedSlug.startsWith(target + '/'));
}

/** The scroll spy observed a slug. Applies the rule above; returns the SAME state
 * reference when nothing changes, so callers can skip a render. */
export function observed(state: ActiveState, slug: string, now: number): ActiveState {
  if (state.intent) {
    const settled = fulfilsIntent(slug, state.intent.target) || now >= state.intent.until;
    if (!settled) return state; // stale frame during the jump — the target holds
    return { slug, intent: null }; // intent resolved; observations drive again
  }
  return slug === state.slug ? state : { slug, intent: null };
}
