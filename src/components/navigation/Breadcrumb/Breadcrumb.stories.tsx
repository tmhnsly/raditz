import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: { description: { component: 'Hierarchical breadcrumb trail; last item is the current page.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Breadcrumb
      items={[
        { label: 'Home', href: '#' },
        { label: 'Components', href: '#' },
        { label: 'Navigation', href: '#' },
        { label: 'Breadcrumb' },
      ]}
    />
  ),
};
