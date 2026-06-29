// Taxonomy grammar — the ONE definition of how a component folder, its showroom
// story title, and its slug relate. Pure (no `fs`, no Vite, no DOM) so BOTH sides
// of the format boundary consume it: the Node pipeline (validate-taxonomy,
// public-surface) and the browser registry (src/explorer/registry.ts). Keeping the
// rule here means the showroom tree is built from the same grammar the release
// gate enforces — they cannot drift. See CONTEXT.md "Component taxonomy".

/** The canonical category set. A component folder MUST be one of these; the value
 *  is the TitleCase segment used in the derived story title. Adding a category
 *  here is the deliberate act of widening the taxonomy (also document it). */
export const CATEGORIES = {
  actions: 'Actions', inputs: 'Inputs', display: 'Display', feedback: 'Feedback',
  typography: 'Typography', layout: 'Layout', surfaces: 'Surfaces', overlay: 'Overlay',
  navigation: 'Navigation', disclosure: 'Disclosure', data: 'Data', media: 'Media', motion: 'Motion',
};

/** Curated showroom overrides: a component whose code lives in one category but
 *  belongs under a different top bucket in the showcase. Keyed `<category>/<Name>`. */
export const TITLE_EXCEPTIONS = {
  'layout/AppShell': 'Pages/App shell',
};

/**
 * The story title a component's folder dictates (or its curated exception).
 * @param {{ category: string, name: string }} e
 * @returns {string | null}
 */
export function expectedTitle(e) {
  const key = `${e.category}/${e.name}`;
  if (TITLE_EXCEPTIONS[key]) return TITLE_EXCEPTIONS[key];
  const seg = CATEGORIES[e.category];
  return seg ? `Components/${seg}/${e.name}` : null;
}

/**
 * A slash-separated title → its trimmed segments (e.g. "Components/Actions/Button").
 * @param {string} title
 * @returns {string[]}
 */
export function titleSegments(title) {
  return String(title).split('/').map((s) => s.trim());
}

/**
 * One path segment → its kebab-case slug form.
 * @param {string} s
 * @returns {string}
 */
export function kebab(s) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * A full title → its kebab slug path (e.g. "components/actions/button").
 * @param {string} title
 * @returns {string}
 */
export function slugForTitle(title) {
  return titleSegments(title).map(kebab).join('/');
}

/**
 * A story export id → a human label, e.g. "A_CenteredDualCTA" → "A Centered Dual CTA".
 * @param {string} id
 * @returns {string}
 */
export function humanize(id) {
  return id
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}
