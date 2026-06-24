import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Components/Surfaces/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component: 'Empty / loading / error placeholder in one component.',
      },
    },
  },
  argTypes: {
    icon: { control: 'text' },
    loading: { control: 'boolean' },
    tone: {
      control: 'select',
      options: ['default', 'accent', 'danger'],
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    icon: 'folder',
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    action: <button type="button">New project</button>,
  },
};
