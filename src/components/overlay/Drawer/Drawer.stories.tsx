import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from '../../controls/Button';

const meta = {
  title: 'Components/Overlay/Drawer',
  component: Drawer,
  parameters: {
    docs: { description: { component: 'Edge panel / sheet with focus trap, scroll lock and dismissal.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          open={open}
          onOpenChange={setOpen}
          side="right"
          title="Settings"
          description="Manage your workspace preferences."
          footer={<Button onClick={() => setOpen(false)}>Done</Button>}
        >
          Drawer body content goes here.
        </Drawer>
      </>
    );
  },
};
