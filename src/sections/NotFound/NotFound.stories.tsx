import type { Meta, StoryObj } from '@storybook/react';
import { NotFoundA } from './NotFound';

const meta: Meta = { title: 'Sections/404' };
export default meta;
type Story = StoryObj;

export const A_CenteredBigCode: Story = {
  name: 'A · Centered, big code',
  render: () => (
    <NotFoundA
      title="This page wandered off"
      message="The page you're after doesn't exist or has moved. Let's get you back on track."
      actions={[
        { label: 'Back home', href: '#' },
        { label: 'Search docs', href: '#', variant: 'ghost' },
      ]}
    />
  ),
};
