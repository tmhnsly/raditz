import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CommandPalette } from './CommandPalette';
import { Button } from '../../controls/Button';

const meta = {
  title: 'Components/Overlay/CommandPalette',
  component: CommandPalette,
  parameters: {
    docs: { description: { component: '⌘K command launcher with fuzzy filtering and keyboard run.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open command palette (⌘K)</Button>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          groups={[
            {
              heading: 'Navigation',
              items: [
                { id: 'home', label: 'Go to Home', shortcut: 'G H', onSelect: () => {} },
                { id: 'projects', label: 'Go to Projects', shortcut: 'G P', onSelect: () => {} },
              ],
            },
            {
              heading: 'Actions',
              items: [
                { id: 'new', label: 'New document', shortcut: '⌘N', keywords: 'create file', onSelect: () => {} },
                { id: 'settings', label: 'Open settings', onSelect: () => {} },
              ],
            },
          ]}
        />
      </>
    );
  },
};
