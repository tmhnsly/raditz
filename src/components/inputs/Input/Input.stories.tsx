import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../Input/Input';

const meta = {
  title: 'Components/Inputs/Input',
  component: Input,
  parameters: {
    docs: { description: { component: 'A text input.' } },
  },
  argTypes: {
    invalid: { control: 'boolean' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { placeholder: 'you@example.com' },
};

export const Invalid: Story = {
  args: { placeholder: 'you@example.com', invalid: true, defaultValue: 'not-an-email' },
};
