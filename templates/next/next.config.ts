import path from 'node:path';
import { existsSync } from 'node:fs';
import type { NextConfig } from 'next';

// DEV ONLY: make Next watch + hot-reload the linked raditz dist while co-developing
// (`pnpm dev` rebuilds that dist on every raditz edit — see scripts/dev.mjs). In a
// production build raditz is consumed as the external pre-built dist, so its Vite-only
// source (`import.meta.glob`) is never pulled into Next's typecheck.
//
// turbopack.root: Turbopack only resolves modules inside its root (inferred as this
// app from its lockfile). The rdz-link override symlinks node_modules/raditz to a
// SIBLING checkout — outside that root — which fails with "Can't resolve 'raditz'"
// under `next dev --turbopack` (webpack `next build` is unaffected). Widen the root
// one level while a local checkout exists; tag-pinned installs skip this.
const raditzCheckout = path.resolve(process.cwd(), '..', 'raditz');
const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === 'development'
    ? {
        transpilePackages: ['raditz'],
        ...(existsSync(raditzCheckout) ? { turbopack: { root: path.resolve(process.cwd(), '..') } } : {}),
      }
    : {}),
};

export default nextConfig;
