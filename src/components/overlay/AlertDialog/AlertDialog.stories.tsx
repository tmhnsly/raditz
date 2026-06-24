import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AlertDialog } from './AlertDialog';
import { Button } from '../../actions/Button';

const meta = {
  title: 'Components/Overlay/AlertDialog',
  component: AlertDialog,
  parameters: {
    docs: { description: { component: 'Modal confirmation requiring an explicit choice.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Delete account</Button>
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete account?"
          description="This permanently removes your account and all associated data. This action cannot be undone."
          cancelText="Cancel"
          actionText="Delete"
          tone="danger"
          onAction={() => {}}
        />
      </>
    );
  },
};
