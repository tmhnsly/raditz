import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // App/explorer showroom output. Kept separate from dist/, which is the
    // exclusive package artifact (referenced by files/exports). Sibling dir
    // (not under dist/) so it never ships inside the package tarball.
    outDir: 'dist-app',
  },
});
