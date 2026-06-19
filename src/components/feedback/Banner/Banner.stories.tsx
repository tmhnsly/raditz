import type { Meta, StoryObj } from '@storybook/react';
import { Banner } from './Banner';

const meta = {
  title: 'Components/Feedback/Banner',
  component: Banner,
  parameters: {
    docs: {
      description: {
        component: 'Inline, in-layout alert bar (vs the floating Toast).',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
    title: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    tone: 'info',
    title: 'Heads up',
    children: 'Your trial ends in 7 days. Upgrade to keep your projects.',
  },
};
