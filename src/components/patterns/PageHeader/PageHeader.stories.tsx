import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';

const meta = {
  title: 'Components/Patterns/PageHeader',
  component: PageHeader,
  parameters: {
    docs: {
      description: {
        component: 'Standard page header: breadcrumb · eyebrow · title · description · actions.',
      },
    },
  },
  argTypes: {
    eyebrow: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    eyebrow: 'Workspace',
    title: 'Projects',
    description: 'Manage and organize all of your team’s projects in one place.',
    actions: <button type="button">New project</button>,
  },
};
