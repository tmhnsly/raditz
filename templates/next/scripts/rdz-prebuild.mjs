// Rebuild the linked raditz checkout before a product build — ONLY while the
// rdz-link override is active (co-dev mode). Unlinked, tag-pinned builds use
// the packaged dist inside node_modules and must not depend on (or silently
// pick up changes from) a sibling checkout.
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const override = pkg.pnpm?.overrides?.raditz ?? '';
if (!override.startsWith('link:')) process.exit(0);

const dir = override.slice('link:'.length);
console.log(`rdz-prebuild: link mode — rebuilding ${dir}`);
execSync('pnpm build:pkg', { cwd: dir, stdio: 'inherit' });
