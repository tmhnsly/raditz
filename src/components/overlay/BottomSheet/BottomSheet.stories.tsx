import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Button } from '../../actions/Button';

const meta = {
  title: 'Components/Overlay/BottomSheet',
  component: BottomSheet,
  parameters: {
    docs: {
      description: {
        component:
          'Bottom-anchored sheet with a grab handle, drag-to-close, focus trap, scroll lock and dismissal.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open sheet</Button>
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          title="Share this page"
          description="Send a link, or copy it to your clipboard."
        >
          Drag the handle (or the title bar) down past a quarter of the sheet to
          dismiss it — or use Escape, the scrim, or the close button.
        </BottomSheet>
      </>
    );
  },
};

export const Tall: Story = {
  name: 'Tall with scrolling body + footer',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open tall sheet</Button>
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          height="tall"
          title="Terms of service"
          description="Please review before continuing."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Decline</Button>
              <Button onClick={() => setOpen(false)}>Accept</Button>
            </>
          }
        >
          {Array.from({ length: 18 }, (_, i) => (
            <p key={i}>
              Clause {i + 1}. The sheet body scrolls independently of the page —
              overscroll is contained so a flick at the end of the list never
              rubber-bands the content behind the scrim. The title bar and the
              footer stay pinned while this text scrolls between them.
            </p>
          ))}
        </BottomSheet>
      </>
    );
  },
};
