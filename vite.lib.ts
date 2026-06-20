import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import preserveDirectives from 'rollup-preserve-directives';

// Empty-module loader: keeps the JS bundle CSS-free (styles ship via dist/raditz.css).
// Component index.ts files do `import './X.scss'`; here those resolve to nothing.
function ignoreStyles() {
  return {
    name: 'raditz-ignore-styles',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (id.endsWith('.scss') || id.endsWith('.css')) return '\0empty-style:' + id;
      return null;
    },
    load(id: string) {
      if (id.startsWith('\0empty-style:')) return 'export default {}';
      return null;
    },
  };
}

export default defineConfig({
  plugins: [
    ignoreStyles(),
    preserveDirectives(),
    dts({
      tsconfigPath: 'tsconfig.build.json',
      include: ['src'],
      exclude: ['**/*.stories.tsx', '**/*.test.tsx'],
      rollupTypes: false,
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: { entry: 'src/index.ts', formats: ['es'] },
    rollupOptions: {
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id.startsWith('react/') ||
        id.startsWith('react-dom/') ||
        id.startsWith('react/jsx-runtime') ||
        id.startsWith('@visx/') ||
        id === 'date-fns' ||
        id.startsWith('date-fns/'),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
