import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PasswordToggleField } from './PasswordToggleField';

const meta = {
  title: 'Components/Inputs/PasswordToggleField',
  component: PasswordToggleField,
  parameters: {
    docs: { description: { component: 'Password input with a show/hide toggle.' } },
  },
  argTypes: {
    placeholder: { control: 'text' },
    defaultVisible: { control: 'boolean' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { placeholder: 'Enter your password' },
  render: (args) => {
    const [value, setValue] = useState('');
    return <PasswordToggleField {...args} value={value} onChange={setValue} />;
  },
};
