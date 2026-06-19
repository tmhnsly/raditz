import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // component stories + section stories + foundation/page docs (.mdx)
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx|js|jsx)',
  ],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // a Docs page for every component story group
  docs: { autodocs: 'tag' },
  // serve the design-system CSS (styles.css + tokens/ + components.css) at site root
  staticDirs: ['../public'],
};

export default config;
