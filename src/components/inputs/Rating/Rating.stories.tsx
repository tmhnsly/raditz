import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Rating } from './Rating';

const meta = {
  title: 'Components/Inputs/Rating',
  component: Rating,
  parameters: {
    docs: { description: { component: 'Star rating input or read-only display.' } },
  },
  argTypes: {
    count: { control: 'number' },
    readOnly: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { count: 5, size: 'md' },
  render: (args) => {
    const [value, setValue] = useState(0);
    return <Rating {...args} value={value} onChange={setValue} />;
  },
};

export const HalfStars: Story = {
  args: { count: 5, size: 'md', precision: 'half' },
  render: (args) => {
    const [value, setValue] = useState(2.5);
    return <Rating {...args} value={value} onChange={setValue} />;
  },
};

export const ReadOnlyFractional: Story = {
  args: { count: 5, size: 'md', readOnly: true, value: 3.2 },
};
