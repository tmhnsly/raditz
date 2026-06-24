import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pill } from './Pill';

const meta = {
  title: 'Components/Display/Pill',
  component: Pill,
  parameters: { docs: { description: { component: 'A rounded, toggleable filter/tag chip. `active` flips it to the accent fill.' } } },
  argTypes: {
    active: { control: 'boolean' },
  },
  args: { children: 'Filter' },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
};

export const FilterRow: Story = {
  render: () => {
    const options = ['All', 'Active', 'Archived', 'Draft'];
    const [selected, setSelected] = useState('All');
    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {options.map((opt) => (
          <Pill key={opt} active={selected === opt} onClick={() => setSelected(opt)}>
            {opt}
          </Pill>
        ))}
      </div>
    );
  },
};
