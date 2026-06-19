import type { Meta, StoryObj } from '@storybook/react';
import { ThemePicker } from '../lib/ThemePicker';
import { ACCENTS, GRAYS } from '../lib/theme';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: {
    docs: {
      description: {
        component:
          'Semantic color tokens aliased over Radix Colors. Components reference these (var(--accent), var(--surface), var(--text)) — never raw Radix steps — so light/dark theming and re-skinning are automatic. Use the theme picker to repoint the accent + gray scales; the whole app follows.',
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

function ScaleRow({ scale }: { scale: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
      <code style={{ width: 64, flex: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-soft)' }}>{scale}</code>
      <div style={{ display: 'flex', flex: 1, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} title={`${scale}-${i + 1}`} style={{ flex: 1, height: 28, background: `var(--${scale}-${i + 1})` }} />
        ))}
      </div>
    </div>
  );
}

function ScaleSection({ title, scales }: { title: string; scales: readonly string[] }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{title}</h3>
      {scales.map((s) => <ScaleRow key={s} scale={s} />)}
    </section>
  );
}

export const Palette: Story = {
  render: () => (
    <div style={{ maxWidth: 1000 }}>
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Theme</h3>
        <ThemePicker />
      </section>
      <Group title="Accent" tokens={['accent', 'accent-hover', 'accent-ink', 'accent-surface', 'accent-border']} ink />
      <Group title="Semantic" tokens={['success', 'warning', 'danger', 'info', 'success-surface', 'warning-surface', 'danger-surface', 'info-surface']} />
      <Group title="Surfaces" tokens={['bg', 'bg-subtle', 'panel', 'surface', 'surface-strong', 'surface-edge']} />
      <Group title="Text & rules" tokens={['text', 'text-soft', 'text-muted', 'text-faint', 'rule-soft', 'rule', 'rule-strong']} />
      <ScaleSection title="Accent scales" scales={ACCENTS} />
      <ScaleSection title="Gray scales" scales={GRAYS} />
    </div>
  ),
};
