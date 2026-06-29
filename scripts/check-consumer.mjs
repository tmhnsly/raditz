// Verifies the built package is consumable: artifacts exist, exports resolve,
// and leaf component chunks don't inline externalized heavy deps.
import fs from 'node:fs';

const must = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exit(1); } };

must(fs.existsSync('dist/index.js'), 'dist/index.js missing — run pnpm build:pkg');
must(fs.existsSync('dist/index.d.ts'), 'dist/index.d.ts missing');
must(fs.existsSync('dist/raditz.css'), 'dist/raditz.css missing');

const css = fs.readFileSync('dist/raditz.css', 'utf8');
must(!/cdn\.jsdelivr|googleapis|gstatic/.test(css), 'CDN reference leaked into dist/raditz.css');
must(css.length > 120000, 'dist/raditz.css is suspiciously small — component SCSS likely tree-shaken out');
must(/@font-face/.test(css), 'dist/raditz.css has no @font-face — self-hosted fonts missing');
must(/--accent/.test(css), 'dist/raditz.css missing the --accent token — tokens not bundled');
// Real component rules must be present — not just stray utility classes. .rdz-btn
// proves the components.ts SCSS aggregate survived the CSS build (a sideEffects
// tree-shake once silently dropped it, leaving tokens only).
must(/\.rdz-btn/.test(css), 'dist/raditz.css has no .rdz-btn rule — component styles not bundled');
const componentClasses = new Set((css.match(/\.rdz-[a-z][a-z-]+/g) || [])).size;
must(componentClasses > 100, `dist/raditz.css has only ${componentClasses} .rdz- classes — component styles likely missing`);

// exports map: importing the package entry resolves and yields named exports.
const mod = await import(new URL('../dist/index.js', import.meta.url));
must(typeof mod === 'object' && Object.keys(mod).length > 50, 'barrel exported too few names');

// tree-shaking guard: Button leaf must not inline visx/date-fns.
const btn = 'dist/components/actions/Button/Button.js';
must(fs.existsSync(btn), `${btn} missing (preserveModules layout changed?)`);
must(!/@visx|date-fns/.test(fs.readFileSync(btn, 'utf8')), 'Button.js inlined an externalized dep');

// RSC guard: hook modules must keep their "use client" directive in dist. A build
// regression that strips directives would silently break every Next consumer.
const hookMod = 'dist/lib/useColorScheme.js';
must(fs.existsSync(hookMod), `${hookMod} missing (lib layout changed?)`);
must(
  /^["']use client["']/.test(fs.readFileSync(hookMod, 'utf8').trimStart()),
  'dist lost the "use client" directive (RSC/Next consumers would break)',
);

console.log('OK: package is consumable (artifacts, exports, tree-shaking, RSC all pass)');
