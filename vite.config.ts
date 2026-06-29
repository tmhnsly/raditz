import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // App/explorer showroom output. Kept separate from dist/, which is the
    // exclusive package artifact (referenced by files/exports). Sibling dir
    // (not under dist/) so it never ships inside the package tarball.
    outDir: 'dist-app',
    rollupOptions: {
      output: {
        // Split the heavy vendors out of the single showroom chunk (was >500 kB):
        // charts (@visx), the icon set (react-icons) and React each become their own
        // cacheable chunk that loads in parallel, instead of one monolith.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-icons')) return 'icons';
          if (id.includes('@visx') || id.includes('d3-')) return 'charts';
          if (/[\\/]react(?:-dom)?[\\/]/.test(id)) return 'react';
          return 'vendor';
        },
      },
    },
  },
});
