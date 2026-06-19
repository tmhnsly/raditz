import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Disclosure/Accordion',
  component: Accordion,
  parameters: {
    docs: { description: { component: 'Stack of collapsible sections.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Accordion
        type="single"
        collapsible
        defaultValue="shipping"
        items={[
          { value: 'shipping', title: 'Shipping & delivery', content: 'Orders ship within 2 business days and arrive in 3–5 days.' },
          { value: 'returns', title: 'Returns & refunds', content: 'Return any item within 30 days for a full refund.' },
          { value: 'support', title: 'Support', content: 'Reach our team 24/7 via chat or email.' },
        ]}
      />
    </div>
  ),
};
