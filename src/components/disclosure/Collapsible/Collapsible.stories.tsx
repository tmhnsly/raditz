import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Collapsible } from './Collapsible';

const meta = {
  title: 'Components/Disclosure/Collapsible',
  component: Collapsible,
  parameters: {
    docs: { description: { component: 'Single show/hide region with a trigger.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ padding: 24, maxWidth: 480 }}>
        <Collapsible open={open} onOpenChange={setOpen} trigger="Advanced settings">
          <p style={{ margin: 0 }}>
            These options are hidden by default to keep the interface simple.
          </p>
        </Collapsible>
      </div>
    );
  },
};
