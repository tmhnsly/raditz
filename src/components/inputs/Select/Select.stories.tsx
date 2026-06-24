import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select } from './Select';

const meta = {
  title: 'Components/Inputs/Select',
  component: Select,
  parameters: {
    docs: { description: { component: 'A styled native select with a custom chevron.' } },
  },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const options = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('us');
    return <Select {...args} aria-label="Country" options={options} value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};
