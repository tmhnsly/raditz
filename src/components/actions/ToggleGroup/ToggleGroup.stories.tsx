import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup } from './ToggleGroup';

const items = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const meta = {
  title: 'Components/Actions/ToggleGroup',
  component: ToggleGroup,
  parameters: { docs: { description: { component: 'Segmented set of toggle buttons. `type="single"` behaves like a radio set; `type="multiple"` lets any number stay pressed.' } } },
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { items },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | string[]>('center');
    return <ToggleGroup {...args} type="single" value={value} onValueChange={setValue} />;
  },
};

export const Multiple: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | string[]>(['left']);
    return <ToggleGroup {...args} type="multiple" value={value} onValueChange={setValue} />;
  },
};
