import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Calendar, type DateRange } from './Calendar';

const meta = {
  title: 'Components/Inputs/Calendar',
  component: Calendar,
  parameters: {
    docs: { description: { component: 'The inline month surface behind DatePicker / DateRangePicker — usable on its own for single-date or range selection.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState('2026-07-03');
    return <Calendar value={value} onValueChange={setValue} />;
  },
};

export const Bounded: Story = {
  name: 'With min / max',
  render: () => {
    const [value, setValue] = useState('2026-07-10');
    return <Calendar value={value} onValueChange={setValue} min="2026-07-05" max="2026-07-20" />;
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ from: '2026-07-06', to: '2026-07-12' });
    return <Calendar range={range} onRangeChange={setRange} />;
  },
};
