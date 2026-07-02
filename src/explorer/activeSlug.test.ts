import { describe, it, expect } from 'vitest';
import { navigationIntent, observed, fulfilsIntent, SETTLE_MS, type ActiveState } from './activeSlug';

// The active-slug machine arbitrates the two writers that used to race: a
// navigation intent (hash change + programmatic jump) and the scroll spy's
// per-frame observations. After a navigation the target holds until an
// observation fulfils it or the settle window passes (= the user really scrolled).

const T0 = 10_000;

describe('navigationIntent', () => {
  it('activates the target immediately, before any scroll frame lands', () => {
    expect(navigationIntent('components/actions/button', T0).slug).toBe('components/actions/button');
  });
});

describe('observed — while a navigation is pending', () => {
  const nav = navigationIntent('components/actions/button', T0);

  it('ignores a stale mid-jump frame: a different slug within the window does not win', () => {
    const next = observed(nav, 'components/display/badge', T0 + 16);
    expect(next.slug).toBe('components/actions/button');
    expect(next).toBe(nav); // same reference — caller skips the render
  });

  it('keeps holding across repeated stale frames until the window closes', () => {
    let state = nav;
    for (const t of [T0 + 16, T0 + 32, T0 + SETTLE_MS - 1]) {
      state = observed(state, 'components/display/badge', t);
    }
    expect(state.slug).toBe('components/actions/button');
  });

  it('resolves when the observation reaches the target — later observations win again', () => {
    const settledState = observed(nav, 'components/actions/button', T0 + 32);
    expect(settledState.intent).toBeNull();
    // The very next frame can move the highlight (user scrolled on).
    expect(observed(settledState, 'components/actions/toggle', T0 + 48).slug).toBe('components/actions/toggle');
  });

  it('resolves on a descendant when the target is a group (headings are not spy-visible)', () => {
    const groupNav = navigationIntent('components/actions', T0);
    const next = observed(groupNav, 'components/actions/button', T0 + 16);
    expect(next.slug).toBe('components/actions/button');
    expect(next.intent).toBeNull();
  });

  it('lets the observation win once the settle window passes (user scrolled away)', () => {
    const next = observed(nav, 'sections/hero', T0 + SETTLE_MS);
    expect(next.slug).toBe('sections/hero');
    expect(next.intent).toBeNull();
  });

  it('holds Overview ("") against entry observations within the window — no descendant match on ""', () => {
    const top = navigationIntent('', T0);
    expect(observed(top, 'components/actions/button', T0 + 16)).toBe(top);
    expect(observed(top, '', T0 + 16).intent).toBeNull(); // observing Overview fulfils it
  });
});

describe('observed — plain scrolling, no pending navigation', () => {
  const idle: ActiveState = { slug: 'components/actions/button', intent: null };

  it('adopts each new observation', () => {
    expect(observed(idle, 'components/actions/toggle', T0).slug).toBe('components/actions/toggle');
  });

  it('returns the same reference for a repeated observation (render dedupe)', () => {
    expect(observed(idle, 'components/actions/button', T0)).toBe(idle);
  });
});

describe('fulfilsIntent', () => {
  it('matches the target itself and entries under a group target', () => {
    expect(fulfilsIntent('a/b', 'a/b')).toBe(true);
    expect(fulfilsIntent('a/b/c', 'a/b')).toBe(true);
  });
  it('rejects siblings, prefix-lookalikes, and non-empty slugs against Overview', () => {
    expect(fulfilsIntent('a/bc', 'a/b')).toBe(false);
    expect(fulfilsIntent('a', 'a/b')).toBe(false);
    expect(fulfilsIntent('a/b', '')).toBe(false);
    expect(fulfilsIntent('', '')).toBe(true);
  });
});
