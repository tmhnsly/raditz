import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox } from './Combobox';

const meta = {
  title: 'Components/Forms/Combobox',
  component: Combobox,
  parameters: {
    docs: { description: { component: 'Searchable single-select with keyboard navigation.' } },
  },
  argTypes: {
    placeholder: { control: 'text' },
    emptyText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'orange', label: 'Orange' },
];

export const Default: Story = {
  args: { placeholder: 'Select a fruit…' },
  render: (args) => {
    const [value, setValue] = useState('');
    return <Combobox {...args} options={fruits} value={value} onChange={setValue} />;
  },
};
