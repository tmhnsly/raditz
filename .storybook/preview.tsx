import React, { useEffect } from 'react';
import type { Preview, Decorator } from '@storybook/react';
import '../src/styles/styles.css'; // design tokens
import '../src/styles/components'; // co-located per-component styles (aggregated)
import '../src/sections/sections.css';

/* Toolbar toggle for light/dark — flips `class="dark"` on <html>, exactly like
   the design system expects. Every token/component re-themes from it. */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light';
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  // Docs pages render many stories; don't force full-height padding there.
  const isDocs = context.viewMode === 'docs';
  return (
    <div style={{ padding: isDocs ? 0 : '1.5rem', background: 'var(--bg-subtle)', minHeight: isDocs ? undefined : '100vh' }}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  // every story group gets an auto-generated Docs page
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: [
          'Overview',
          'Foundations', ['Colors', 'Typography', 'Spacing', 'Radius', 'Elevation', 'Motion'],
          'Components', [
            'Typography', 'Controls', 'Forms', 'Surfaces', 'Layout',
            'Navigation', 'Overlay', 'Menu', 'Disclosure', 'Feedback',
            'Data', 'Media', 'Patterns', 'Utility', 'Foundation',
          ],
          'Sections',
          'Pages',
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Light / dark theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
