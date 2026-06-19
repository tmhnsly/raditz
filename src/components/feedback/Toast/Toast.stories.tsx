import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta = {
  title: 'Components/Feedback/Toast',
  component: Toast,
  parameters: {
    docs: {
      description: {
        component: 'Toast viewport — mount once; fire with Toast.show(...).',
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'bottom-center', 'top-center'],
    },
    duration: { control: 'number' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    position: 'bottom-right',
  },
  render: (args) => (
    <div>
      <button
        type="button"
        onClick={() =>
          Toast.show({ title: 'Saved', description: 'Your changes have been saved.', variant: 'success' })
        }
      >
        Show toast
      </button>
      <Toast {...args} />
    </div>
  ),
};
