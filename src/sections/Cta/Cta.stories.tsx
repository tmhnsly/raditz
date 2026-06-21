import type { Meta, StoryObj } from '@storybook/react';
import { CtaA, CtaB } from './Cta';

const meta: Meta = { title: 'Sections/CTA band' };
export default meta;
type Story = StoryObj;

export const A_Centered: Story = {
  name: 'A · Centered',
  render: () => (
    <CtaA
      title="Ready to build something consistent?"
      actions={[
        { label: 'Get started free', href: '#' },
        { label: 'Talk to us', href: '#', variant: 'outline' },
      ]}
    />
  ),
};

export const B_Split: Story = {
  name: 'B · Split, accent surface',
  render: () => (
    <CtaB
      title="Start shipping today"
      sub="No credit card required."
      emailCapture={{ placeholder: 'you@studio.com', action: { label: 'Request access' } }}
    />
  ),
};
