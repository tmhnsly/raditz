// Verifies the built showroom (dist-app) actually bundled every style channel.
//
// Why this exists: component/section styles reach the app through side-effect-only
// TS barrels (src/styles/components.ts, sections.ts). package.json `sideEffects`
// once listed only `**/*.css`, which declared those .ts barrels pure — Rollup
// tree-shook them and the deployed showroom silently lost ALL rdz-* component CSS
// while tokens + directly-imported css survived (looked fine in dev, broken in
// prod). The root fix is the `src/styles/**` sideEffects entry; this script is the
// gate that keeps the failure mode from ever shipping again. check-consumer.mjs is
// the equivalent gate for the package artifact (dist/raditz.css).
//
// Method: for every source stylesheet the app imports (directly or via the
// barrels' globs), take its first literal class selector and require it in the
// built CSS. Derived from source, so new components/sections are covered
// automatically; files with no class (mixin-only partials) are skipped.
import fs from 'node:fs';
import path from 'node:path';

const must = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exit(1); } };

const cssFiles = fs.existsSync('dist-app/assets')
  ? fs.readdirSync('dist-app/assets').filter((f) => f.endsWith('.css'))
  : [];
must(cssFiles.length > 0, 'no CSS in dist-app/assets — run pnpm build first');
const built = cssFiles.map((f) => fs.readFileSync(path.join('dist-app/assets', f), 'utf8')).join('\n');

must(/--accent/.test(built), 'tokens missing (--accent) — src/styles/styles.css not bundled');

// Recursively collect the stylesheets behind each app style channel.
const walk = (dir, exts) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p, exts) : exts.some((x) => e.name.endsWith(x)) ? [p] : [];
});
const sources = [
  ...walk('src/components', ['.scss']), // via styles/components.ts glob
  ...walk('src/pages', ['.scss']), //      "
  ...walk('src/sections', ['.css']), //  via styles/sections.ts (+ co-located glob)
  'src/App.css', //                      direct imports (explorer shell)
  'src/explorer/explorer.css', //          "
];

const firstClass = (file) => {
  const css = fs
    .readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '') // block comments
    .replace(/\/\/[^\n]*/g, ''); //      scss line comments
  // A class selector at the start of a line — avoids .ext mentions in strings.
  return css.match(/^\s*(\.[a-zA-Z][a-zA-Z0-9_-]+)/m)?.[1] ?? null;
};

const missing = sources
  .map((f) => ({ file: f, cls: firstClass(f) }))
  .filter(({ cls }) => cls && !built.includes(cls));
must(
  missing.length === 0,
  `built CSS is missing styles from ${missing.length} source file(s) — tree-shaken barrel?\n` +
    missing.map(({ file, cls }) => `  ${file} (${cls})`).join('\n'),
);

console.log(`OK: dist-app CSS contains all ${sources.length} source stylesheets' styles.`);
