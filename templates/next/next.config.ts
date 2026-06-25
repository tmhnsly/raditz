import type { NextConfig } from 'next';

// `transpilePackages: ['raditz']` lets Next WATCH + hot-reload the linked raditz dist
// during co-development (`pnpm dev` rebuilds it on every raditz edit — see scripts/dev.mjs).
// raditz still ships pre-built ESM/CSS, so this only adds watching, not a real transpile;
// it's harmless (and a no-op for watching) when raditz is the installed git dependency.
const nextConfig: NextConfig = {
  transpilePackages: ['raditz'],
};

export default nextConfig;
