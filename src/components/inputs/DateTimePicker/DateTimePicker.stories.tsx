import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DateTimePicker } from './DateTimePicker';

const meta = {
  title: 'Components/Inputs/DateTimePicker',
  component: DateTimePicker,
  parameters: { docs: { description: { component: 'The drill-up DatePicker and the TimePicker composed; emits a combined `YYYY-MM-DDTHH:mm` value.' } } },
  argTypes: { hour12: { control: 'boolean' }, disabled: { control: 'boolean' } },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => {
    const [v, setV] = useState('2026-06-20T09:30');
    return <DateTimePicker {...args} value={v} onValueChange={setV} />;
  },
};
