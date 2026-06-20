import type { NextConfig } from 'next';

// NOTE: `transpilePackages: ['raditz']` is intentionally NOT set. Raditz ships
// pre-built ESM + types + one CSS file in dist/, so Next consumes it directly.
const nextConfig: NextConfig = {};

export default nextConfig;
