import type { Meta, StoryObj } from '@storybook/react';
import { useResolvedLengths } from './useTokenValues';

const meta: Meta = {
  title: 'Foundations/Spacing',
  parameters: {
    docs: { description: { component: 'The Radix Themes space scale (1–9 plus full-bleed steps 10–12). Author with these tokens, never raw px.' } },
  },
};
export default meta;
type Story = StoryObj;

const STEPS = ['space-1', 'space-2', 'space-3', 'space-4', 'space-5', 'space-6', 'space-7', 'space-8', 'space-9', 'space-10', 'space-11', 'space-12'];

function SpacingScale() {
  const values = useResolvedLengths(STEPS);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', maxWidth: 760 }}>
      {STEPS.map((t) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', width: 96, flex: 'none' }}>--{t}</code>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-faint)', width: 56, flex: 'none', textAlign: 'right' }}>{values[t] ?? '·'}</code>
          <div style={{ height: 18, width: `var(--${t})`, background: 'var(--accent)', borderRadius: 'var(--radius-xs)' }} />
        </div>
      ))}
    </div>
  );
}

export const Scale: Story = {
  render: () => <SpacingScale />,
};
