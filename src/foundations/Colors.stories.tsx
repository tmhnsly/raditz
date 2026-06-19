import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: {
    docs: {
      description: {
        component:
          'Semantic color tokens aliased over Radix Colors. Components reference these (var(--accent), var(--surface), var(--text)) — never raw Radix steps — so light/dark theming and re-skinning are automatic. Toggle the Theme toolbar to see them flip.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

function Swatch({ token, ink }: { token: string; ink?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          height: 56,
          borderRadius: 'var(--radius-md)',
          background: `var(--${token})`,
          border: '1px solid var(--surface-edge)',
          display: 'grid',
          placeItems: 'center',
          color: ink ? 'var(--on-accent)' : 'var(--text)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
        }}
      >
        {ink ? 'Aa' : ''}
      </div>
      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-soft)' }}>--{token}</code>
    </div>
  );
}

function Group({ title, tokens, ink }: { title: string; tokens: string[]; ink?: boolean }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
        {tokens.map((t) => <Swatch key={t} token={t} ink={ink} />)}
      </div>
    </section>
  );
}

export const Palette: Story = {
  render: () => (
    <div style={{ maxWidth: 980 }}>
      <Group title="Accent (Cyan)" tokens={['accent', 'accent-hover', 'accent-ink', 'accent-surface', 'accent-border']} ink />
      <Group title="Secondary (Iris)" tokens={['accent-2', 'accent-2-ink', 'accent-2-surface']} />
      <Group title="Semantic" tokens={['success', 'warning', 'danger', 'info', 'success-surface', 'warning-surface', 'danger-surface', 'info-surface']} />
      <Group title="Surfaces" tokens={['bg', 'bg-subtle', 'panel', 'surface', 'surface-strong', 'surface-edge']} />
      <Group title="Text & rules" tokens={['text', 'text-soft', 'text-muted', 'text-faint', 'rule-soft', 'rule', 'rule-strong']} />
    </div>
  ),
};
