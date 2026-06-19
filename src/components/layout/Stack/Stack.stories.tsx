import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';

const box = { height: 60, width: 60, background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)' };

const meta = {
  title: 'Components/Layout/Stack',
  component: Stack,
  parameters: { docs: { description: { component: 'Flexbox stack — vertical or horizontal, token-gapped.' } } },
  argTypes: {
    direction: { control: 'select', options: ['row', 'column'] },
    gap: { control: 'number' },
    wrap: { control: 'boolean' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Vertical: Story = {
  args: { direction: 'column', gap: 4 },
  render: (args) => (
    <Stack {...args}>
      <div style={box} />
      <div style={box} />
      <div style={box} />
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: { direction: 'row', gap: 4 },
  render: (args) => (
    <Stack {...args}>
      <div style={box} />
      <div style={box} />
      <div style={box} />
    </Stack>
  ),
};
