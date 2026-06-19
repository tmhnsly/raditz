import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu } from './NavigationMenu';

const meta = {
  title: 'Components/Navigation/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    docs: { description: { component: 'Horizontal site navigation with dropdown panels.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <NavigationMenu
        items={[
          {
            label: 'Products',
            content: (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
                <li><a href="#">Analytics</a></li>
                <li><a href="#">Automation</a></li>
                <li><a href="#">Reports</a></li>
              </ul>
            ),
          },
          {
            label: 'Resources',
            content: (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Guides</a></li>
              </ul>
            ),
          },
          { label: 'Pricing', href: '#' },
          { label: 'Contact', href: '#' },
        ]}
      />
    </div>
  ),
};
