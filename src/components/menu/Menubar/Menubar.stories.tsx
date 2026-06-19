import type { Meta, StoryObj } from '@storybook/react';
import { Menubar } from './Menubar';

const meta = {
  title: 'Components/Menu/Menubar',
  component: Menubar,
  parameters: {
    docs: { description: { component: 'Horizontal app-style menu bar.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Menubar
      menus={[
        {
          label: 'File',
          items: [
            { label: 'New', shortcut: '⌘N', onSelect: () => {} },
            { label: 'Open', shortcut: '⌘O', onSelect: () => {} },
            { separator: true },
            { label: 'Save', shortcut: '⌘S', onSelect: () => {} },
          ],
        },
        {
          label: 'Edit',
          items: [
            { label: 'Undo', shortcut: '⌘Z', onSelect: () => {} },
            { label: 'Redo', shortcut: '⇧⌘Z', onSelect: () => {} },
            { separator: true },
            { label: 'Cut', onSelect: () => {} },
            { label: 'Copy', onSelect: () => {} },
          ],
        },
        {
          label: 'View',
          items: [
            { heading: true, label: 'Appearance' },
            { label: 'Zoom In', shortcut: '⌘+', onSelect: () => {} },
            { label: 'Zoom Out', shortcut: '⌘-', onSelect: () => {} },
          ],
        },
      ]}
    />
  ),
};
