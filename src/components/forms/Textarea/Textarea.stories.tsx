import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Forms/Textarea',
  component: Textarea,
  parameters: {
    docs: { description: { component: 'A multi-line text input.' } },
  },
  argTypes: {
    invalid: { control: 'boolean' },
    rows: { control: 'number' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { placeholder: 'Write a message…', rows: 4 },
};
