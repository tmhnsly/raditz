import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { OneTimePasswordField } from './OneTimePasswordField';

const meta = {
  title: 'Components/Forms/OneTimePasswordField',
  component: OneTimePasswordField,
  parameters: {
    docs: { description: { component: 'Segmented one-time-code input with auto-advance + paste.' } },
  },
  argTypes: {
    length: { control: 'number' },
    type: { control: 'select', options: ['text', 'password'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { length: 6, type: 'text' },
  render: (args) => {
    const [value, setValue] = useState('');
    return <OneTimePasswordField {...args} value={value} onChange={setValue} />;
  },
};
