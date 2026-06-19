import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './ScrollArea';

const meta = {
  title: 'Components/Utility/ScrollArea',
  component: ScrollArea,
  parameters: { docs: { description: { component: 'Scroll container with a slim themed scrollbar.' } } },
  argTypes: {
    axis: { control: 'select', options: ['vertical', 'horizontal', 'both'] },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { axis: 'vertical', maxHeight: 160 },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <ScrollArea {...args}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)' }}>
              Row {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
