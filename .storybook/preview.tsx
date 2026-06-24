import React, { useEffect } from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { useReplay } from '../src/components/internal';
import '../src/styles/styles.css'; // design tokens
import '../src/styles/components'; // co-located per-component styles (aggregated)
import '../src/styles/sections'; // shared utilities + every section's co-located .css

/* Toolbar toggle for light/dark — flips `class="dark"` on <html>, exactly like
   the design system expects. Every token/component re-themes from it. */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light';
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  // Docs pages render many stories; don't force full-height padding there.
  const isDocs = context.viewMode === 'docs';
  // .rdz-preview opts stories into the bordered preview "card" chrome (Frame is
  // flat by default now — that's the real-page look).
  return (
    <div className="rdz-preview" style={{ padding: isDocs ? 0 : '1.5rem', background: 'var(--bg-subtle)', minHeight: isDocs ? undefined : '100vh' }}>
      <Story />
    </div>
  );
};

/* Universal Replay: a workbench-only control that remounts the story subtree so
   any entrance animation (Reveal / TextReveal / Vignette / title-anim) re-fires —
   the AnimationsA pattern, made global via useReplay. Applies on every story AND
   its Docs canvas. Harmless on static stories. Story tests never see this (no
   setProjectAnnotations → composeStories ignores preview decorators), so the a11y
   gate is unaffected. The explorer showroom has its own per-variant Replay (its
   renderer ignores Storybook decorators) — see explorer/StoryView.tsx. */
const withReplay: Decorator = (Story) => {
  const { key, replay } = useReplay();
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={replay}
        aria-label="Replay story animations"
        style={{
          position: 'absolute', top: 8, right: 8, zIndex: 10,
          font: 'inherit', fontSize: 12, lineHeight: 1, padding: '5px 10px',
          borderRadius: 6, border: '1px solid var(--rule, #8884)',
          background: 'var(--surface, #fff)', color: 'var(--text, inherit)',
          cursor: 'pointer', opacity: 0.8,
        }}
      >
        ↻ Replay
      </button>
      <div key={key}>
        <Story />
      </div>
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
            'Typography', 'Display', 'Actions', 'Inputs', 'Feedback',
            'Surfaces', 'Layout', 'Navigation', 'Overlay', 'Disclosure',
            'Data', 'Media', 'Motion',
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
  decorators: [withTheme, withReplay],
};

export default preview;
