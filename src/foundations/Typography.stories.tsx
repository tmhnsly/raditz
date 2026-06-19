import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Two families — Space Grotesk (display/UI) and Space Mono (eyebrows, code, metadata) — with a fluid display scale and fixed steps below it.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const SCALE: [string, string][] = [
  ['--fs-display-2xl', 'Display 2XL'],
  ['--fs-display-xl', 'Display XL'],
  ['--fs-display-l', 'Display L'],
  ['--fs-display', 'Display'],
  ['--fs-h1', 'Heading 1'],
  ['--fs-h2', 'Heading 2'],
  ['--fs-h3', 'Heading 3'],
  ['--fs-h4', 'Heading 4'],
  ['--fs-body-l', 'Body large'],
  ['--fs-body', 'Body'],
  ['--fs-body-s', 'Body small'],
  ['--fs-caption', 'Caption'],
];

export const Scale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 900 }}>
      {SCALE.map(([token, label]) => (
        <div key={token} style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', borderBottom: '1px solid var(--rule-soft)', paddingBottom: '0.75rem' }}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', width: 160, flex: 'none' }}>{token}</code>
          <span style={{ fontSize: `var(${token})`, letterSpacing: '-0.02em', lineHeight: 1.05, fontWeight: 600 }}>{label}</span>
        </div>
      ))}
      <div style={{ marginTop: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-mono)', color: 'var(--text-soft)' }}>
          Space&nbsp;Mono — eyebrows · code · metadata
        </span>
      </div>
    </div>
  ),
};
