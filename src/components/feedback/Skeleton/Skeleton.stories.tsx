import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component: 'Shimmering placeholder for loading states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circle', 'rect'],
    },
    width: { control: 'text' },
    height: { control: 'text' },
    lines: { control: 'number' },
    loading: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'text',
    lines: 3,
  },
};
