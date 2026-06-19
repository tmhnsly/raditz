import type { Meta, StoryObj } from '@storybook/react';
import { FullBleed } from './FullBleed';

const meta = {
  title: 'Components/Layout/FullBleed',
  component: FullBleed,
  parameters: { docs: { description: { component: 'Breaks out of its container to span the full viewport width.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 480, marginInline: 'auto', overflow: 'hidden' }}>
      <div style={{ height: 60, background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)' }} />
      <FullBleed {...args}>
        <div style={{ height: 80, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-ink)' }}>
          Full-bleed band
        </div>
      </FullBleed>
      <div style={{ height: 60, marginTop: '0.75rem', background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)' }} />
    </div>
  ),
};
