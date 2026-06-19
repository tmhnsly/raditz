import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';

const meta = {
  title: 'Components/Forms/Form',
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
