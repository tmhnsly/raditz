// `pnpm dev`: fast product dev by default — Next with Turbopack only.
// To co-develop the linked raditz library at the same time, run `pnpm dev:lib`
// (sets RADITZ_DEV=1): it ALSO builds raditz once and rebuilds dist/ on every edit,
// so library changes hot-reload here. Without it, raditz is consumed as its existing
// prebuilt dist (rebuild manually with `pnpm -C ../raditz build:pkg` if you edit it).
//
// Why: plain `next dev` runs webpack, and running it alongside the library watcher
// pegged the CPU on spin-up (two bundlers at once). Turbopack + an opt-in watcher
// keep spin-up cool. Ctrl-C cleans up both.
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
} else if (hasCheckout) {
  // Linked but not co-developing: consume the existing prebuilt dist. If it's missing
  // (freshly-linked checkout never built), build it ONCE — no watcher, so spin-up stays
  // cool. Edit raditz live with `pnpm dev:lib`.
  if (!existsSync(`${RADITZ}/dist/index.js`)) {
    console.log('▲ raditz dist missing — building it once (no watch).');
    await sh('pnpm', ['-C', RADITZ, 'build:pkg']);
  } else {
    console.log('▲ raditz local checkout present, NOT watched — run `pnpm dev:lib` (RADITZ_DEV=1) to co-develop it.');
  }
} else {
  console.log('▲ raditz installed (no local checkout) — running next dev only.');
}
run('npx', ['next', 'dev', '--turbopack']);

const shutdown = () => { for (const p of procs) p.kill('SIGINT'); process.exit(0); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
