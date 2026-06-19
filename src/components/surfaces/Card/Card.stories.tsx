import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Surfaces/Card',
  component: Card,
  parameters: { docs: { description: { component: 'The base surface — solid, glass or flat.' } } },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'glass', 'flat'] },
    interactive: { control: 'boolean' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { variant: 'solid' },
  render: (args) => (
    <Card {...args} style={{ padding: '1.5rem', maxWidth: 360 }}>Card content</Card>
  ),
};
