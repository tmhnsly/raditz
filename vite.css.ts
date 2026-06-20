import { defineConfig } from 'vite';

// Builds ONE stylesheet (dist/raditz.css) from src/styles/bundle.ts.
//
// NB: this is a plain (non-`lib`) build on purpose. Vite's library mode
// force-inlines every asset as a base64 data URI (it ignores
// `assetsInlineLimit` when `build.lib` is set), which would bloat the CSS and
// fail the "fonts copied to dist/assets/" contract. A regular build with a
// single rollup input + `assetsInlineLimit: 0` emits the woff2 files as
// separate assets and rewrites the @font-face url()s to point at them.
//
// cssCodeSplit:false guarantees a single stylesheet; the throwaway JS chunk
// (_styles-bundle.js) is an empty side-effect entry and is ignored.
export default defineConfig({
  // Relative asset URLs (./assets/...) so the published stylesheet resolves its
  // fonts wherever the consumer serves dist/raditz.css from.
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: false, // vite.lib.ts already populated dist/
    cssCodeSplit: false,
    assetsInlineLimit: 0, // emit fonts as files in dist/assets/, never inline
    rollupOptions: {
      input: { '_styles-bundle': 'src/styles/bundle.ts' },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: (info) =>
          info.name && info.name.endsWith('.css') ? 'raditz.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
