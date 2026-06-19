import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Controls/Progress',
  component: Progress,
  parameters: { docs: { description: { component: 'Determinate or indeterminate progress bar. Pass `value` (0–`max`) for determinate; omit it for an indeterminate loop.' } } },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    indeterminate: { control: 'boolean' },
  },
  args: { value: 60 },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Indeterminate: Story = {
  args: { value: null, indeterminate: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 320 }}>
      <Progress {...args} size="sm" />
      <Progress {...args} size="md" />
      <Progress {...args} size="lg" />
    </div>
  ),
};
