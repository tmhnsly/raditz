import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Surfaces/Avatar',
  component: Avatar,
  parameters: { docs: { description: { component: 'A user / brand avatar — image, monogram, or accent orb.' } } },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['solid', 'orb'] },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = { args: { initials: 'TH', size: 'md', variant: 'solid' } };

export const Orb: Story = { args: { size: 'lg', variant: 'orb' } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Avatar initials="S" size="sm" />
      <Avatar initials="M" size="md" />
      <Avatar initials="L" size="lg" />
      <Avatar initials="X" size="xl" />
    </div>
  ),
};
