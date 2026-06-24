import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator';

const meta = {
  title: 'Components/Layout/Separator',
  component: Separator,
  parameters: { docs: { description: { component: 'A hairline divider rule.' } } },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <div style={{ paddingBottom: '0.75rem' }}>Above the rule</div>
      <Separator {...args} />
      <div style={{ paddingTop: '0.75rem' }}>Below the rule</div>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', height: 40 }}>
      <span>Left</span>
      <Separator {...args} />
      <span>Right</span>
    </div>
  ),
};
