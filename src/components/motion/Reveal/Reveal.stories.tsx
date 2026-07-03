import type { Meta, StoryObj } from '@storybook/react';
import { Reveal, RevealGroup, type RevealAnim } from './Reveal';

const meta: Meta = { title: 'Components/Motion/Reveal', parameters: { replay: true } };
export default meta;
type Story = StoryObj;

const DemoCard = ({ label }: { label: string }) => (
  <div className="rdz-card col sx-gap-2" style={{ padding: 'var(--space-5)' }}>
    <strong>{label}</strong>
    <span className="muted">Reveals as it scrolls into view.</span>
  </div>
);

export const StaggeredGroup: Story = {
  name: 'Staggered group (fade-rise)',
  render: () => (
    <RevealGroup style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((n) => (
        <Reveal key={n}><DemoCard label={n} /></Reveal>
      ))}
    </RevealGroup>
  ),
};

export const EachAnim: Story = {
  name: 'Per-anim (fade / rise / scale / blur / slide)',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      {(['fade', 'rise', 'scale', 'blur', 'slide-left', 'slide-right'] as RevealAnim[]).map((a) => (
        <Reveal key={a} anim={a}><DemoCard label={a} /></Reveal>
      ))}
    </div>
  ),
};
