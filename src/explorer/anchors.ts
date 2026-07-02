// Anchor-id contract — the one place that ties the long page's markup to the
// scroll-spy and to hash navigation. StoryView renders two kinds of anchored
// elements, and only ONE of them is spy-visible:
//
//   - `<section id={entry.slug} class="sec">`   → an entry; the spy tracks these.
//   - `<h2 id={groupSlug} class="page-group">`  → a group heading; a scroll TARGET
//     (Explorer's `go()` resolves any slug via getElementById) but invisible to the
//     spy — the spy reports the deepest ENTRY under the activation line, so landing
//     on a group heading reads as its first entry.
//
// Rename a class here and both the markup and the spy selector move together;
// renaming it in only one place was previously a silent way to kill the spy.

/** Class of an entry `<section>` — the spy-visible anchor. */
export const SECTION_CLASS = 'sec';

/** Modifier for entries whose story meta asks for a full-bleed stage. */
export const SECTION_FULLSCREEN_CLASS = `${SECTION_CLASS}--fullscreen`;

/** Class of a group heading `<h2>` — anchored (navigable) but NOT spy-visible. */
export const GROUP_HEADING_CLASS = 'page-group';

/** Level modifier for a group heading (l0 sticks under the bar — see App.css). */
export const groupHeadingLevelClass = (level: number): string => `${GROUP_HEADING_CLASS}--l${level}`;

/** Selector for every spy-visible anchor: entry sections that carry an id. */
export const SPY_SECTION_SELECTOR = `.${SECTION_CLASS}[id]`;
