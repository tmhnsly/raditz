// Generates catalog/llms.txt — the LLM-facing component catalog.
// Walks the SAME public surface as gen-barrel (a dir is public iff it has a
// *.stories.tsx). For each public component/section file, react-docgen-typescript
// extracts the exported components' descriptions + own props (inherited HTML/React
// attrs are filtered out). Story export names are listed as examples. Hand-written
// never — run `pnpm gen:catalog`.
//
// The parsing/rendering helpers below are exported pure functions so
// scripts/gen-catalog.test.mjs can pin their edge cases (like taxonomy.mjs);
// generation itself only runs when this file is the entry script.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';
import { LIB, sourceSurface } from './public-surface.mjs';

// Extract story export names from a *.stories.tsx source (CSF3 named exports).
export function storyExportNames(src) {
  const names = [];
  const re = /export const (\w+)\s*[:=]/g;
  let m;
  while ((m = re.exec(src))) if (m[1] !== 'default') names.push(m[1]);
  return names;
}

function storyExampleNames(dir, base) {
  const file = path.join(dir, `${base}.stories.tsx`);
  if (!fs.existsSync(file)) return [];
  return storyExportNames(fs.readFileSync(file, 'utf8'));
}

export function fmtProp(p) {
  const opt = p.required ? '' : '?';
  let type = (p.type && p.type.name) || 'unknown';
  // Expand enums/unions to their literal members: enum -> 'a' | 'b' | 'c'
  if (type === 'enum' && p.type && Array.isArray(p.type.value)) {
    const members = p.type.value.map((m) => m.value).filter(Boolean);
    // Drop the noisy `undefined` member optionals carry; keep it readable.
    const cleaned = members.filter((m) => m !== 'undefined');
    if (cleaned.length && cleaned.length <= 12) type = cleaned.join(' | ');
  }
  const dv = p.defaultValue && p.defaultValue.value;
  const def = dv !== undefined && dv !== null && dv !== '' ? ` (default: ${dv})` : '';
  const desc = p.description ? ` — ${p.description.replace(/\s+/g, ' ').trim()}` : '';
  return `  - ${p.name}${opt}: ${type}${def}${desc}`;
}

export function usageSnippet(doc) {
  // Hooks (use*) are public API too, but they're called, not rendered as JSX.
  if (/^use[A-Z]/.test(doc.displayName)) return `const result = ${doc.displayName}();`;
  const hasChildren = doc.props && Object.prototype.hasOwnProperty.call(doc.props, 'children');
  return hasChildren ? `<${doc.displayName}>…</${doc.displayName}>` : `<${doc.displayName} />`;
}

export function renderDoc(doc, examples) {
  const out = [`### ${doc.displayName}`, `Import: \`import { ${doc.displayName} } from 'raditz'\``];
  if (doc.description) out.push('', doc.description.replace(/\s+/g, ' ').trim());
  const props = Object.values(doc.props || {});
  if (props.length) {
    out.push('', 'Props:');
    for (const p of props.sort((a, b) => a.name.localeCompare(b.name))) out.push(fmtProp(p));
  } else {
    out.push('', 'Props: none');
  }
  if (examples.length) out.push('', `Examples (Storybook stories): ${examples.join(', ')}`);
  out.push('', 'Usage:', '```tsx', usageSnippet(doc), '```');
  return out.join('\n');
}

// Parse exported identifiers from a utility/hook module source (no JSX rendering).
// Covers: function/const/let/type/interface/class/enum declarations + re-exports.
export function parseExportNames(src) {
  const names = new Set();
  const declRe = /^export\s+(?:async\s+)?(?:function|const|let|type|interface|class|enum)\s+(\w+)/gm;
  let m;
  while ((m = declRe.exec(src))) names.add(m[1]);
  const reRe = /^export\s+\{([^}]+)\}/gm;
  while ((m = reRe.exec(src))) {
    for (const part of m[1].split(',')) {
      // Handle "X as Y" re-exports — use the exported name (Y), not the local.
      const alias = part.match(/\bas\s+(\w+)/);
      if (alias) {
        names.add(alias[1].trim());
      } else {
        const name = part.trim();
        if (name) names.add(name);
      }
    }
  }
  return [...names].sort();
}

// Extract the leading block comment / JSDoc from a source file (before any imports).
export function extractLeadingDesc(src) {
  const m = src.match(/^\/\*\*([\s\S]*?)\*\//);
  if (!m) return '';
  return m[1].replace(/^\s*\*\s?/gm, '').trim();
}

// Render a utility/hook module entry (no react-docgen docs — not a component).
export function renderUtilityEntry(basename, src) {
  const exportNames = parseExportNames(src);
  const desc = extractLeadingDesc(src);
  const out = [
    `### ${basename}`,
    `Import: \`import { ${exportNames.join(', ')} } from 'raditz'\``,
    '',
    desc ? desc : `Utility module — see exports below.`,
    '',
    'Exports:',
    ...exportNames.map((n) => `  - ${n}`),
    '',
    '> Note: This is a utility/hook module, not a React component — do not render as JSX.',
  ];
  return out.join('\n');
}

// Public utility CSS classes advertised in the catalog. Every class listed here
// MUST exist in the shipped styles — scripts/gen-catalog.test.mjs greps the style
// sources for each selector, so drift fails the suite.
export const UTILITIES = [
  ['.h-display', 'Largest display heading (hero titles).'],
  ['.h-section', 'Section heading.'],
  ['.lede', 'Lead paragraph under a heading.'],
  ['.eyebrow2', 'Small label above a heading.'],
  ['.muted', 'De-emphasized text colour.'],
  ['.row / .col', 'Flex row / column with token gaps.'],
];

function main() {
  // One parser/TS program, reused across files (faster than per-file default config).
  // Deviation from brief: using withCustomConfig('./tsconfig.json', ...) instead of
  // withCompilerOptions({ jsx: 'react-jsx', ... }) because withCompilerOptions
  // requires numeric TypeScript JsxEmit enum values (e.g. 4) not string literals —
  // passing 'react-jsx' throws "jsx is a string value; tsconfig JSON must be parsed...".
  // withCustomConfig reads tsconfig.json and correctly resolves jsx+moduleResolution.
  const parser = withCustomConfig('./tsconfig.json', {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    // Keep only props declared in our own source; drop inherited DOM/React props
    // (their `parent.fileName` lives in node_modules).
    propFilter: (prop) =>
      !prop.parent || !prop.parent.fileName.includes('node_modules'),
  });

  // Collect public files using the shared source surface.
  const { components: surfaceComponents, sections: surfaceSections } = sourceSurface();
  const items = [
    ...surfaceComponents.map((e) => ({
      category: e.category,
      label: e.category,
      dir: e.dir,
      file: e.componentFile,
      base: e.name,
    })),
    ...surfaceSections.map((e) => ({
      category: 'sections',
      label: 'sections',
      dir: e.dir,
      file: e.componentFile,
      base: e.name,
    })),
  ];
  const byCategory = new Map();
  let componentCount = 0;

  for (const it of items) {
    if (!fs.existsSync(it.file)) continue;
    let docs;
    try {
      docs = parser.parse(it.file);
    } catch (e) {
      console.warn(`SKIP ${it.file}: ${e.message}`);
      continue;
    }
    if (!docs.length) {
      console.warn(`WARN: ${it.file} yielded zero docs — it will be omitted from the catalog.`);
      continue;
    }
    const examples = storyExampleNames(it.dir, it.base);
    const blocks = docs
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .map((d) => renderDoc(d, examples));
    componentCount += docs.length;
    if (!byCategory.has(it.category)) byCategory.set(it.category, []);
    byCategory.get(it.category).push(...blocks);
  }

  // Process lib exports from the shared public surface allowlist.
  for (const libPath of LIB) {
    // libPath is like './lib/Frame' — resolve to a real file (try .tsx then .ts).
    const basename = path.basename(libPath);
    const base = libPath.replace(/^\.\/lib\//, '');
    const tryPaths = [
      path.join('src', 'lib', `${base}.tsx`),
      path.join('src', 'lib', `${base}.ts`),
    ];
    const filePath = tryPaths.find((p) => fs.existsSync(p));
    if (!filePath) {
      console.warn(`WARN: lib entry ${libPath} — no file found (tried ${tryPaths.join(', ')})`);
      continue;
    }

    let docs;
    try {
      docs = parser.parse(filePath);
    } catch (e) {
      console.warn(`SKIP lib ${filePath}: ${e.message}`);
      continue;
    }

    if (!byCategory.has('lib')) byCategory.set('lib', []);

    // .tsx = React component file → use react-docgen output (props + usage).
    // .ts  = utility/hook module   → use the generated Exports listing fallback.
    if (filePath.endsWith('.tsx') && docs.length) {
      const blocks = docs
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
        .map((d) => renderDoc(d, []));
      componentCount += docs.length;
      byCategory.get('lib').push(...blocks);
    } else {
      // Utility/hook module (or component file with no docgen output) —
      // generate a fallback Exports listing from the source text.
      const src = fs.readFileSync(filePath, 'utf8');
      byCategory.get('lib').push(renderUtilityEntry(basename, src));
      componentCount += 1;
    }
  }

  const header = [
    '# Raditz Component Catalog',
    '',
    'Raditz is a pre-built design-system package. CONSUME it — never re-implement a',
    'component that exists here, and never edit `node_modules/raditz`.',
    '',
    '- Import components/sections from the package root: `import { Button, HeroA } from \'raditz\'`.',
    '- Import the stylesheet ONCE at the app root: `import \'raditz/styles.css\'`.',
    '- Props below are the component-specific API; standard HTML attributes also pass through.',
    '- **Style through the interface, not the DOM.** Customise via props (`align`, `background`,',
    '  `scrim`, tones), theme tokens (`--accent-*` in your `theme.css`), or the `children`',
    '  override slot — never with CSS selectors that reach into a component\'s internal',
    '  markup (`.sx-* > .h-section`, descendant chains on `rdz-`/`sx-` internals). Internal',
    '  DOM structure is not a stable interface and WILL change between releases; if the knob',
    '  you need is missing, add it to the library instead of styling around it.',
    '',
    '## Composing a page',
    '',
    'A page is an ordered list of sections (`<NavbarA/> <HeroA/> … <FooterA/>`). Sections',
    'are **edge-to-edge by default** — full-bleed bands, each bringing its own inner gutter',
    '+ max-width — so you just stack them; never hand-roll page padding or inline `style`',
    'for layout. Wrap the app once in `<div className="rdz-page">` to pin the `Navbar`',
    'sticky (the next/vite templates already do). For a bespoke full-bleed band that is NOT',
    'one of the canned sections, use `SectionShell` (`background`/`image`/`scrim` + children)',
    'instead of reaching for raw layout classes.',
    '',
    'BACKGROUND RHYTHM — choose section `background`s for FLOW, not decoration. Give the hero',
    'the media (`image`+`scrim`) or one gradient; keep most content sections `none`/`surface`',
    '(alternating subtly); reserve a gradient or accent band (e.g. `StatsB`) for ONE mid-page',
    'emphasis plus the closing CTA. NEVER stack two different gradients adjacent — it reads as',
    'random "willy-nilly" backgrounds rather than a designed page.',
    '',
    'HERO BLEED — add `rdz-bleed` next to `rdz-page` so the nav floats over the first section',
    'and the hero background reaches the very top (no nav "band"). On an `image`+`scrim` hero,',
    'text goes on-dark (white) automatically; use the `glass` or default (accent) button — and',
    '`secondary` now stays legible over media too, so no CTA goes invisible on a photo.',
    '',
    `${componentCount} exported components across ${byCategory.size} categories.`,
    '',
  ];

  const utilitiesBlock = [
    '## utilities (CSS classes)',
    '',
    'For BESPOKE layout only — prefer components/sections first. These public classes',
    'come from `raditz/styles.css` (already imported); use them in a section\'s `children`',
    'or your own markup:',
    '',
    ...UTILITIES.map(([cls, desc]) => `- \`${cls}\` — ${desc}`),
    '',
  ];

  const sections = [];
  for (const cat of [...byCategory.keys()].sort()) {
    sections.push(`## ${cat}`, '', byCategory.get(cat).join('\n\n'), '');
  }

  fs.mkdirSync('catalog', { recursive: true });
  fs.writeFileSync('catalog/llms.txt', header.concat(utilitiesBlock).concat(sections).join('\n'));
  console.log(`wrote catalog/llms.txt (${componentCount} components in ${byCategory.size} categories)`);
}

// Run only as an entry script — importing this module (e.g. from the tests) must
// not regenerate the catalog.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
