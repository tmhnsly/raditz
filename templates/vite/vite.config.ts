import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Co-developing a linked raditz (`pnpm dev:lib`): don't pre-bundle the linked
  // package, so a rebuilt dist/ is picked up on reload instead of a stale copy.
  optimizeDeps: { exclude: ['raditz'] },
});
