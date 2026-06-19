import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta = {
  title: 'Components/Typography/Text',
  component: Text,
  parameters: { docs: { description: { component: 'Body copy with size + ink + weight tokens. `measure` clamps line length for long-form prose.' } } },
  argTypes: {
    size: { control: 'select', options: ['l', 'base', 's', 'caption'] },
    tone: { control: 'select', options: ['default', 'soft', 'muted', 'faint', 'accent'] },
    weight: { control: 'select', options: ['regular', 'medium', 'semibold', 'bold'] },
    measure: { control: 'boolean' },
  },
  args: { children: 'The spice must flow across the dunes of Arrakis.' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text {...args} size="l">Large body text</Text>
      <Text {...args} size="base">Base body text</Text>
      <Text {...args} size="s">Small body text</Text>
      <Text {...args} size="caption">Caption text</Text>
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text {...args} tone="default">Default tone</Text>
      <Text {...args} tone="soft">Soft tone</Text>
      <Text {...args} tone="muted">Muted tone</Text>
      <Text {...args} tone="faint">Faint tone</Text>
      <Text {...args} tone="accent">Accent tone</Text>
    </div>
  ),
};
