import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/Actions/IconButton',
  component: IconButton,
  parameters: { docs: { description: { component: 'Square, icon-only button. Always pass an `aria-label`. `variant` matches Button\'s weights.' } } },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'soft', 'outline', 'ghost', 'glass'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { icon: 'plus', 'aria-label': 'Add item' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <IconButton {...args} variant="solid" aria-label="Solid" />
      <IconButton {...args} variant="soft" aria-label="Soft" />
      <IconButton {...args} variant="outline" aria-label="Outline" />
      <IconButton {...args} variant="ghost" aria-label="Ghost" />
    </div>
  ),
};

// Glass needs something behind it to frost — shown over a gradient.
export const Glass: Story = {
  render: (args) => (
    <div style={{ padding: '2rem', borderRadius: 'var(--radius-card)', background: 'linear-gradient(120deg, var(--accent-surface), var(--accent-2-surface))', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <IconButton {...args} variant="glass" aria-label="Glass" />
    </div>
  ),
};
