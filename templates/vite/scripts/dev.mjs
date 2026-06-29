// `pnpm dev`: fast product dev — just Vite. To co-develop the linked raditz library,
// run `pnpm dev:lib` (sets RADITZ_DEV=1): it ALSO builds raditz once and rebuilds dist/
// on every edit, so library changes show up here (Vite re-resolves the linked dep on
// reload — see optimizeDeps.exclude in vite.config). Without it, raditz is consumed as
// its existing prebuilt dist. Ctrl-C cleans up both.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const RADITZ = process.env.RADITZ_PATH || '../raditz';
const coDev = process.env.RADITZ_DEV === '1' || process.env.RADITZ_DEV === 'true';
const hasCheckout = existsSync(`${RADITZ}/package.json`);
const procs = [];
const run = (cmd, args, opts = {}) => {
  const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  procs.push(p);
  return p;
};
const sh = (cmd, args, opts = {}) =>
  new Promise((resolve) => spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts }).on('exit', resolve));

if (coDev && hasCheckout) {
  console.log(`▲ raditz co-dev (${RADITZ}) — building once + watching for live edits.`);
  run('node', ['scripts/watch.mjs'], { cwd: RADITZ }); // initial build + watch
} else if (hasCheckout && !existsSync(`${RADITZ}/dist/index.js`)) {
  console.log('▲ raditz dist missing — building it once (no watch).');
  await sh('pnpm', ['-C', RADITZ, 'build:pkg']);
} else if (hasCheckout) {
  console.log('▲ raditz local checkout present, NOT watched — run `pnpm dev:lib` (RADITZ_DEV=1) to co-develop it.');
} else {
  console.log('▲ raditz installed (no local checkout) — running vite only.');
}
run('npx', ['vite']);

const shutdown = () => { for (const p of procs) p.kill('SIGINT'); process.exit(0); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
