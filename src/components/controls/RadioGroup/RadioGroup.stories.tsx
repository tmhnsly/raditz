import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';

const items = [
  { value: 'starter', label: 'Starter', description: 'For small teams getting going.' },
  { value: 'pro', label: 'Pro', description: 'For growing teams that need more.' },
  { value: 'enterprise', label: 'Enterprise', description: 'Advanced controls and support.' },
];

const meta = {
  title: 'Components/Controls/RadioGroup',
  component: RadioGroup,
  parameters: { docs: { description: { component: 'A set of mutually-exclusive radios with labels + descriptions. Items are `{ value, label, description?, disabled? }`.' } } },
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
  },
  args: { items },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('pro');
    return <RadioGroup {...args} value={value} onValueChange={setValue} />;
  },
};

export const Horizontal: Story = {
  render: (args) => {
    const [value, setValue] = useState('starter');
    return <RadioGroup {...args} orientation="horizontal" value={value} onValueChange={setValue} />;
  },
};
