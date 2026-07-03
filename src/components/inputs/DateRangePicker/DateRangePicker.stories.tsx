import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';
import type { DateRange } from '../Calendar';

const meta = {
  title: 'Components/Inputs/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    docs: { description: { component: 'A trigger that opens a calendar in range mode — pick a start then an end (hover previews the span).' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange>({});
    return <DateRangePicker value={value} onValueChange={setValue} />;
  },
};

export const Prefilled: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange>({ from: '2026-07-06', to: '2026-07-12' });
    return <DateRangePicker value={value} onValueChange={setValue} />;
  },
};

export const Bounded: Story = {
  name: 'With min / max',
  render: () => {
    const [value, setValue] = useState<DateRange>({});
    return <DateRangePicker value={value} onValueChange={setValue} min="2026-07-05" max="2026-07-25" />;
  },
};
