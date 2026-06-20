// Generates catalog/llms.txt — the LLM-facing component catalog.
// Walks the SAME public surface as gen-barrel (a dir is public iff it has a
// *.stories.tsx). For each public component/section file, react-docgen-typescript
// extracts the exported components' descriptions + own props (inherited HTML/React
// attrs are filtered out). Story export names are listed as examples. Hand-written
// never — run `pnpm gen:catalog`.
import fs from 'node:fs';
import path from 'node:path';
import { withCustomConfig } from 'react-docgen-typescript';
import { LIB } from './public-surface.mjs';

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

function hasStory(dir) {
  return fs.readdirSync(dir).some((f) => f.endsWith('.stories.tsx'));
}

function storyExampleNames(dir, base) {
  const file = path.join(dir, `${base}.stories.tsx`);
  if (!fs.existsSync(file)) return [];
  const src = fs.readFileSync(file, 'utf8');
  const names = [];
  const re = /export const (\w+)\s*[:=]/g;
  let m;
  while ((m = re.exec(src))) if (m[1] !== 'default') names.push(m[1]);
  return names;
}

function fmtProp(p) {
  const opt = p.required ? '' : '?';
  const type = (p.type && p.type.name) || 'unknown';
  const dv = p.defaultValue && p.defaultValue.value;
  const def = dv !== undefined && dv !== null && dv !== '' ? ` (default: ${dv})` : '';
  const desc = p.description ? ` — ${p.description.replace(/\s+/g, ' ').trim()}` : '';
  return `  - ${p.name}${opt}: ${type}${def}${desc}`;
}

function usageSnippet(doc) {
  // Hooks (use*) are public API too, but they're called, not rendered as JSX.
  if (/^use[A-Z]/.test(doc.displayName)) return `const result = ${doc.displayName}();`;
  const hasChildren = doc.props && Object.prototype.hasOwnProperty.call(doc.props, 'children');
  return hasChildren ? `<${doc.displayName}>…</${doc.displayName}>` : `<${doc.displayName} />`;
}

function renderDoc(doc, examples) {
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
function parseExportNames(src) {
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
function extractLeadingDesc(src) {
  const m = src.match(/^\/\*\*([\s\S]*?)\*\//);
  if (!m) return '';
  return m[1].replace(/^\s*\*\s?/gm, '').trim();
}

// Render a utility/hook module entry (no react-docgen docs — not a component).
function renderUtilityEntry(basename, src) {
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

// Collect public files as { category, label, dir, file, base }.
function collect() {
  const items = [];
  const compRoot = 'src/components';
  for (const cat of fs.readdirSync(compRoot).sort()) {
    const catDir = path.join(compRoot, cat);
    if (cat === 'internal' || !fs.statSync(catDir).isDirectory()) continue;
    for (const name of fs.readdirSync(catDir).sort()) {
      const dir = path.join(catDir, name);
      if (!fs.statSync(dir).isDirectory() || !hasStory(dir)) continue;
      items.push({ category: cat, label: cat, dir, file: path.join(dir, `${name}.tsx`), base: name });
    }
  }
  const secRoot = 'src/sections';
  for (const name of fs.readdirSync(secRoot).sort()) {
    const dir = path.join(secRoot, name);
    if (!fs.statSync(dir).isDirectory() || !hasStory(dir)) continue;
    items.push({ category: 'sections', label: 'sections', dir, file: path.join(dir, `${name}.tsx`), base: name });
  }
  return items;
}

const items = collect();
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
  '',
  `${componentCount} exported components across ${byCategory.size} categories.`,
  '',
];

const sections = [];
for (const cat of [...byCategory.keys()].sort()) {
  sections.push(`## ${cat}`, '', byCategory.get(cat).join('\n\n'), '');
}

fs.mkdirSync('catalog', { recursive: true });
fs.writeFileSync('catalog/llms.txt', header.concat(sections).join('\n'));
console.log(`wrote catalog/llms.txt (${componentCount} components in ${byCategory.size} categories)`);
