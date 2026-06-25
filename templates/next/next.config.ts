import type { NextConfig } from 'next';

// DEV ONLY: make Next watch + hot-reload the linked raditz dist while co-developing
// (`pnpm dev` rebuilds it on every raditz edit — see scripts/dev.mjs). In a production
// build raditz is consumed as the external pre-built dist, so its Vite-only source
// (`import.meta.glob`) is never pulled into Next's typecheck.
const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === 'development' ? { transpilePackages: ['raditz'] } : {}),
};

export default nextConfig;
