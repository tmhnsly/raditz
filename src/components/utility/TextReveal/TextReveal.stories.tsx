import type { Meta, StoryObj } from '@storybook/react';
import { TextReveal, type TextRevealAnim } from './TextReveal';

const meta: Meta = { title: 'Components/Utility/TextReveal' };
export default meta;
type Story = StoryObj;

export const PerAnim: Story = {
  name: 'Per-word (flip / rise / mask / blur)',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      {(['flip', 'rise', 'mask', 'blur'] as TextRevealAnim[]).map((a) => (
        <TextReveal key={a} as="h3" className="h-section" anim={a} text="Ship a polished UI on day one" />
      ))}
    </div>
  ),
};

export const PerChar: Story = {
  name: 'Per-character (flip)',
  render: () => (
    <TextReveal as="h2" className="h-display" by="char" anim="flip" stagger={28} text="Raditz" />
  ),
};
