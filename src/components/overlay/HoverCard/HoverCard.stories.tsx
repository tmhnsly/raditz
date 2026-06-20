import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './HoverCard';
import { Button } from '../../controls/Button';

const meta = {
  title: 'Components/Overlay/HoverCard',
  component: HoverCard,
  parameters: {
    docs: { description: { component: 'Preview content shown on hover/focus.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <HoverCard
      side="bottom"
      align="center"
      trigger={<Button>Hover me</Button>}
    >
      <div style={{ padding: '0.5rem 0.25rem', maxWidth: '16rem' }}>
        <strong>@raditz</strong>
        <p>A React component library. Hover the trigger to reveal this preview card.</p>
      </div>
    </HoverCard>
  ),
};
