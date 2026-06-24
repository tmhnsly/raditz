import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from '../../actions/Button';

const meta = {
  title: 'Components/Overlay/Dialog',
  component: Dialog,
  parameters: {
    docs: { description: { component: 'Modal overlay with focus trap, scroll lock and dismissal.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Share this document"
          description="Anyone with the link can view this document."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Share</Button>
            </>
          }
        >
          Choose how you want to share access with your team.
        </Dialog>
      </>
    );
  },
};
