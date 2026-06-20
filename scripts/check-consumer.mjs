// Verifies the built package is consumable: artifacts exist, exports resolve,
// and leaf component chunks don't inline externalized heavy deps.
import fs from 'node:fs';

const must = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exit(1); } };

must(fs.existsSync('dist/index.js'), 'dist/index.js missing — run pnpm build:pkg');
must(fs.existsSync('dist/index.d.ts'), 'dist/index.d.ts missing');
must(fs.existsSync('dist/raditz.css'), 'dist/raditz.css missing');

const css = fs.readFileSync('dist/raditz.css', 'utf8');
must(!/cdn\.jsdelivr|googleapis|gstatic/.test(css), 'CDN reference leaked into dist/raditz.css');
must(css.length > 10000, 'dist/raditz.css is suspiciously small — build likely dropped styles');
must(/@font-face/.test(css), 'dist/raditz.css has no @font-face — self-hosted fonts missing');
must(/--accent/.test(css), 'dist/raditz.css missing the --accent token — tokens not bundled');
must(/\.rdz-/.test(css), 'dist/raditz.css has no .rdz- component rules — component styles not bundled');

// exports map: importing the package entry resolves and yields named exports.
const mod = await import(new URL('../dist/index.js', import.meta.url));
must(typeof mod === 'object' && Object.keys(mod).length > 50, 'barrel exported too few names');

// tree-shaking guard: Button leaf must not inline visx/date-fns.
const btn = 'dist/components/controls/Button/Button.js';
must(fs.existsSync(btn), `${btn} missing (preserveModules layout changed?)`);
must(!/@visx|date-fns/.test(fs.readFileSync(btn, 'utf8')), 'Button.js inlined an externalized dep');

console.log('OK: package is consumable (artifacts, exports, tree-shaking all pass)');
