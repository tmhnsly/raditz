import { addons } from 'storybook/internal/manager-api';
import { create } from 'storybook/internal/theming/create';

// Brand the whole Storybook UI (sidebar + toolbar chrome), not just the canvas, so
// the manager reads as part of SuperRadix. (Manager theme is set once here; the
// canvas still flips light/dark live via the toolbar toggle in preview.tsx.)
addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'SuperRadix',
    brandUrl: '/',
    colorPrimary: '#00a2c7', // cyan-9 (default accent)
    colorSecondary: '#5b5bd6', // iris-9 (secondary accent)
    appBg: '#0c1116',
    appContentBg: '#0c1116',
    appPreviewBg: '#0c1116',
    appBorderColor: '#1f2830',
    appBorderRadius: 10,
    barBg: '#0c1116',
    barSelectedColor: '#00a2c7',
    textColor: '#e3e8ee',
    textMutedColor: '#8a94a3',
    fontBase: '"Space Grotesk", system-ui, sans-serif',
    fontCode: '"Space Mono", ui-monospace, monospace',
  }),
});
