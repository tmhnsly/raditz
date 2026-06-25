// `pnpm dev`: live library + product co-development from ONE command.
// If raditz is a local sibling checkout (linked via `pnpm rdz:link`), build it once and
// watch it (rebuild dist/ on every edit) while running `next dev` — so editing raditz
// shows up in the app (HMR via transpilePackages, or a refresh). If raditz is the
// installed package (CI / no local checkout), just run `next dev`. Ctrl-C cleans up both.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const RADITZ = process.env.RADITZ_PATH || '../raditz';
const procs = [];
const run = (cmd, args, opts = {}) => {
  const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  procs.push(p);
  return p;
};

if (existsSync(`${RADITZ}/package.json`)) {
  console.log(`▲ raditz local (${RADITZ}) — building once + watching for live edits.`);
  run('node', ['scripts/watch.mjs'], { cwd: RADITZ }); // initial build + watch
} else {
  console.log('▲ raditz installed (no local checkout) — running next dev only.');
}
run('npx', ['next', 'dev']);

const shutdown = () => { for (const p of procs) p.kill('SIGINT'); process.exit(0); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
