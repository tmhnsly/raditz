import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from './ContextMenu';

const meta = {
  title: 'Components/Menu/ContextMenu',
  component: ContextMenu,
  parameters: {
    docs: { description: { component: 'Right-click menu over a target area.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ContextMenu
      items={[
        { heading: true, label: 'Edit' },
        { label: 'Cut', shortcut: '⌘X', onSelect: () => {} },
        { label: 'Copy', shortcut: '⌘C', onSelect: () => {} },
        { label: 'Paste', shortcut: '⌘V', onSelect: () => {} },
        { separator: true },
        { label: 'Delete', danger: true, onSelect: () => {} },
      ]}
    >
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          width: '20rem',
          height: '10rem',
          border: '1px dashed var(--srx-border, #ccc)',
          borderRadius: '0.5rem',
          userSelect: 'none',
        }}
      >
        Right-click anywhere in this area
      </div>
    </ContextMenu>
  ),
};
