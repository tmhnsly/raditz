import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';

const meta = {
  title: 'Components/Inputs/Form',
  component: Form,
  parameters: {
    docs: { description: { component: 'Data-driven form with native + custom validation and per-field messages.' } },
  },
  argTypes: {
    submitLabel: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    submitLabel: 'Create account',
    fields: [
      {
        name: 'name',
        label: 'Full name',
        required: true,
        placeholder: 'Ada Lovelace',
        messages: { valueMissing: 'Please enter your name.' },
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'you@example.com',
        messages: {
          valueMissing: 'Email is required.',
          typeMismatch: 'Please enter a valid email.',
        },
      },
      {
        name: 'bio',
        label: 'Bio',
        type: 'textarea',
        hint: 'Tell us a little about yourself.',
        maxLength: 280,
      },
    ],
    onSubmit: (values: Record<string, unknown>) => console.log('submit', values),
  },
};

// A `select` field plus a CONDITIONAL field: "Please specify" appears (and becomes
// required) only when the reason is "Other".
export const ConditionalField: Story = {
  args: {
    submitLabel: 'Send',
    fields: [
      { name: 'name', label: 'Name', required: true },
      {
        name: 'reason',
        label: 'Reason for contact',
        type: 'select',
        placeholder: 'Choose one…',
        options: [
          { value: 'support', label: 'Support' },
          { value: 'sales', label: 'Sales' },
          { value: 'Other', label: 'Other' },
        ],
      },
      {
        name: 'detail',
        label: 'Please specify',
        required: true,
        when: (v: Record<string, string>) => v.reason === 'Other',
      },
    ],
    onSubmit: (values: Record<string, unknown>) => console.log('submit', values),
  },
};
