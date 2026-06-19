import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Radius',
  parameters: {
    docs: { description: { component: 'The semantic radius scale (XS→XL) plus role aliases. Small = formal, large = friendly; corners scale proportionally with element size.' } },
  },
};
export default meta;
type Story = StoryObj;

const TOKENS = ['radius-xs', 'radius-sm', 'radius-md', 'radius-lg', 'radius-xl', 'radius-full'];
const ROLES = ['radius-control', 'radius-card', 'radius-panel', 'radius-overlay', 'radius-chip'];

function Tile({ token }: { token: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <div style={{ width: 96, height: 72, background: 'var(--accent-surface)', border: '1px solid var(--accent-border)', borderRadius: `var(--${token})` }} />
      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-soft)' }}>--{token}</code>
    </div>
  );
}

export const Scale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '1rem' }}>T-shirt scale</h3>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>{TOKENS.map((t) => <Tile key={t} token={t} />)}</div>
      </div>
      <div>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Role aliases</h3>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>{ROLES.map((t) => <Tile key={t} token={t} />)}</div>
      </div>
    </div>
  ),
};
