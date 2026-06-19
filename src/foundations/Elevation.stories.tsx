import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Elevation',
  parameters: {
    docs: { description: { component: 'The Radix Themes shadow scale (1–6) built on a fixed black-alpha ramp, so shadows read correctly on any surface and deepen automatically in dark mode.' } },
  },
};
export default meta;
type Story = StoryObj;

const SHADOWS = ['shadow-1', 'shadow-2', 'shadow-3', 'shadow-4', 'shadow-5', 'shadow-6'];

export const Scale: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '2rem', padding: '1rem', maxWidth: 900 }}>
      {SHADOWS.map((t) => (
        <div key={t} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <div style={{ width: '100%', height: 90, background: 'var(--panel)', borderRadius: 'var(--radius-card)', boxShadow: `var(--${t})` }} />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-soft)' }}>--{t}</code>
        </div>
      ))}
    </div>
  ),
};
