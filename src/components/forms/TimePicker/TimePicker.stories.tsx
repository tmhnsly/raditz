import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TimePicker } from './TimePicker';

const meta = {
  title: 'Components/Forms/TimePicker',
  component: TimePicker,
  parameters: { docs: { description: { component: 'A time picker with hour / minute (/ AM-PM) columns. Value is a canonical 24-hour "HH:mm" string; display follows `hour12`.' } } },
  argTypes: {
    hour12: { control: 'boolean' },
    minuteStep: { control: 'number' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => {
    const [v, setV] = useState('09:30');
    return <TimePicker {...args} value={v} onChange={setV} />;
  },
};

export const TwentyFourHour: Story = {
  name: '24-hour',
  render: () => {
    const [v, setV] = useState('14:45');
    return <TimePicker hour12={false} value={v} onChange={setV} />;
  },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: '08:00' } };
