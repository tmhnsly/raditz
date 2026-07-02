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

// Taxonomy first: a folder outside the category set, or a story title that has
// drifted from its folder, blocks the release before anything is regenerated.
run('pnpm validate:taxonomy');

run('pnpm gen:barrel');
run('pnpm gen:catalog');

// RSC boundary: the codemod must be a no-op on a releasable tree. A component
// that gained hooks/handlers but never got its 'use client' directive isn't a
// generated-artifact drift (the barrel/catalog diff can't see it), so it gets
// its own gate: run the codemod and block if it had to mark anything.
const codemod = run('pnpm codemod:use-client');
if (!/marked 0 file/.test(codemod)) {
  console.error("BLOCKED: sources were missing their 'use client' directive (the codemod just added them):");
  console.error(codemod.trim());
  console.error('Review and commit the added directives (pnpm codemod:use-client) before releasing.');
  process.exit(1);
}

const tracked = ['src/index.ts', 'catalog/llms.txt'];
const dirty = run(`git status --porcelain ${tracked.join(' ')}`).trim();

if (dirty) {
  console.error('BLOCKED: generated artifacts are out of date. Regenerated and found drift:');
  console.error(dirty);
  console.error('Commit the regenerated files (pnpm gen:barrel && pnpm gen:catalog) before releasing.');
  process.exit(1);
}

console.log('OK: barrel + catalog are up to date; client boundaries are marked.');
