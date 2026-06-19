import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Feedback/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: 'Indeterminate loading spinner (currentColor, inline-sized).',
      },
    },
  },
  argTypes: {
    size: { control: 'text' },
    strokeWidth: { control: 'number' },
    label: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    size: '2rem',
  },
};
