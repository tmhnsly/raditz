// Toggle a pnpm override pointing `raditz` at a local library checkout for live
// fixes (the "link" flow). Usage: node scripts/rdz-link.mjs link|unlink
// RADITZ_PATH overrides the default sibling path ../raditz.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const mode = process.argv[2];
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.pnpm ||= {};
pkg.pnpm.overrides ||= {};

if (mode === 'link') {
  const target = process.env.RADITZ_PATH || '../raditz';
  pkg.pnpm.overrides.raditz = `link:${target}`;
  console.log(`Linked raditz → ${target}. Co-develop with \`pnpm dev:lib\` (build + watch), or rebuild once with \`pnpm -C ${target} build:pkg\`.`);
} else if (mode === 'unlink') {
  delete pkg.pnpm.overrides.raditz;
  if (Object.keys(pkg.pnpm.overrides).length === 0) delete pkg.pnpm.overrides;
  console.log('Unlinked raditz → restored the pinned git dependency.');
} else {
  console.error('usage: node scripts/rdz-link.mjs link|unlink');
  process.exit(1);
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
execSync('pnpm install', { stdio: 'inherit' });
