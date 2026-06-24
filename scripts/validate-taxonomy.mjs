// Taxonomy guard: the component FOLDER is the single source of truth, and each
// story's `meta.title` must be the title DERIVED from that folder. Reuses
// sourceSurface() (the same public-surface walk barrel/catalog/tests use), so a
// new component can't drift its showroom title away from its folder, and a folder
// outside the documented category set is rejected. Wired into release-preflight
// and the test suite; see CONTEXT.md "Component taxonomy".
import fs from 'node:fs';
import { sourceSurface } from './public-surface.mjs';

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

/** The story title a component's folder dictates (or its curated exception). */
export function expectedTitle(e) {
  const key = `${e.category}/${e.name}`;
  if (TITLE_EXCEPTIONS[key]) return TITLE_EXCEPTIONS[key];
  const seg = CATEGORIES[e.category];
  return seg ? `Components/${seg}/${e.name}` : null;
}

const TITLE_RE = /title:\s*['"]([^'"]+)['"]/;
export function readTitle(storyFile) {
  const m = fs.readFileSync(storyFile, 'utf8').match(TITLE_RE);
  return m ? m[1] : null;
}

/** Returns { errors, counts }. `errors` empty ⇒ taxonomy is in sync. */
export function validateTaxonomy() {
  const { components } = sourceSurface();
  const errors = [];
  const counts = {};
  for (const e of components) {
    counts[e.category] = (counts[e.category] ?? 0) + 1;
    if (!(e.category in CATEGORIES)) {
      errors.push(`Unknown category "${e.category}" for ${e.name} (${e.dir}). Add it to CATEGORIES + CONTEXT.md, or refile.`);
      continue;
    }
    const actual = readTitle(e.storyFile);
    const want = expectedTitle(e);
    if (!actual) errors.push(`${e.category}/${e.name}: story has no meta.title`);
    else if (actual !== want) errors.push(`${e.category}/${e.name}: title "${actual}" !== expected "${want}"`);
  }
  return { errors, counts };
}

// CLI: print counts, exit non-zero on any violation.
if (import.meta.url === `file://${process.argv[1]}`) {
  const { errors, counts } = validateTaxonomy();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log('Category counts:', JSON.stringify(counts, null, 0));
  if (errors.length) {
    console.error(`\nTAXONOMY VIOLATIONS (${errors.length}):\n` + errors.map((s) => '  - ' + s).join('\n'));
    process.exit(1);
  }
  console.log(`OK: ${total} components across ${Object.keys(CATEGORIES).length} categories; folders = titles.`);
}
