import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';
import { Input } from '../Input/Input';

const meta = {
  title: 'Components/Inputs/Field',
  component: Field,
  parameters: {
    docs: { description: { component: 'A labelled form row: label + control + hint/error.' } },
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    label: 'Email',
    hint: 'We’ll never share your email.',
    htmlFor: 'field-email',
  },
  render: (args) => (
    <Field {...args}>
      <Input id="field-email" placeholder="you@example.com" />
    </Field>
  ),
};

export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Please enter a valid email address.',
    required: true,
    htmlFor: 'field-email-error',
  },
  render: (args) => (
    <Field {...args}>
      <Input id="field-email-error" placeholder="you@example.com" />
    </Field>
  ),
};
