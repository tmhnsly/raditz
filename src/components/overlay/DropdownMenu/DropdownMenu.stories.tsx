import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';
import { Button } from '../../actions/Button';

const meta = {
  title: 'Components/Overlay/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    docs: { description: { component: 'Button-triggered menu with keyboard navigation.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <DropdownMenu
      trigger={<Button>Open menu</Button>}
      items={[
        { heading: true, label: 'Account' },
        { label: 'Profile', shortcut: '⌘P', onSelect: () => {} },
        { label: 'Settings', shortcut: '⌘,', onSelect: () => {} },
        { separator: true },
        { label: 'New file', onSelect: () => {} },
        { label: 'Archived', disabled: true },
        { separator: true },
        { label: 'Sign out', danger: true, onSelect: () => {} },
      ]}
    />
  ),
};
