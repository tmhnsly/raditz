// Release preflight: regenerate the generated artifacts and fail if that leaves
// uncommitted drift — i.e. the barrel or catalog were stale. This guarantees a
// tagged release ships an in-sync src/index.ts and catalog/llms.txt.
// (The build + test + a11y gate is run separately by the release skill.)
import { execSync } from 'node:child_process';

const run = (cmd) => {
  try {
    return execSync(cmd, { stdio: 'pipe' }).toString();
  } catch (e) {
    // Surface the failed sub-command's own output instead of a bare Node stack.
    if (e.stdout) process.stdout.write(e.stdout);
    if (e.stderr) process.stderr.write(e.stderr);
    console.error(`\nBLOCKED: \`${cmd}\` failed during release preflight.`);
    process.exit(1);
  }
};

run('pnpm gen:barrel');
run('pnpm gen:catalog');

const tracked = ['src/index.ts', 'catalog/llms.txt'];
const dirty = run(`git status --porcelain ${tracked.join(' ')}`).trim();

if (dirty) {
  console.error('BLOCKED: generated artifacts are out of date. Regenerated and found drift:');
  console.error(dirty);
  console.error('Commit the regenerated files (pnpm gen:barrel && pnpm gen:catalog) before releasing.');
  process.exit(1);
}

console.log('OK: barrel + catalog are up to date.');
