import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'Components/Inputs/DatePicker',
  component: DatePicker,
  parameters: {
    docs: { description: { component: 'Text trigger that opens a calendar popover; value is an ISO date string.' } },
  },
  argTypes: {
    placeholder: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { placeholder: 'Select date' },
  render: (args) => {
    const [value, setValue] = useState('');
    return <DatePicker {...args} value={value} onChange={setValue} />;
  },
};
