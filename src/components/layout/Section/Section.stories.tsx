import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';

const box = { height: 60, background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)' };

const meta = {
  title: 'Components/Layout/Section',
  component: Section,
  parameters: { docs: { description: { component: 'A vertical page section with consistent block rhythm.' } } },
  argTypes: {
    gap: { control: 'number' },
    pad: { control: 'number' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { gap: 5, pad: 11 },
  render: (args) => (
    <Section {...args}>
      <div style={box} />
      <div style={box} />
      <div style={box} />
    </Section>
  ),
};
