import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Display/Badge',
  component: Badge,
  parameters: { docs: { description: { component: 'A small status / category label. `variant` is the fill style, `color` the semantic tone.' } } },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'soft', 'outline'] },
    color: { control: 'select', options: ['accent', 'neutral', 'success', 'warning', 'danger', 'info'] },
    dot: { control: 'boolean' },
  },
  args: { children: 'Badge' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge {...args} variant="solid">Solid</Badge>
      <Badge {...args} variant="soft">Soft</Badge>
      <Badge {...args} variant="outline">Outline</Badge>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge {...args} color="accent">Accent</Badge>
      <Badge {...args} color="neutral">Neutral</Badge>
      <Badge {...args} color="success">Success</Badge>
      <Badge {...args} color="warning">Warning</Badge>
      <Badge {...args} color="danger">Danger</Badge>
      <Badge {...args} color="info">Info</Badge>
    </div>
  ),
};
