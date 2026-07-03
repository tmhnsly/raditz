import type { Meta, StoryObj } from '@storybook/react';
import { CtaA, CtaB } from './Cta';
import { demoWide } from '../../demos/images';

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

const IMG = demoWide;

export const A_OverImageScrim: Story = {
  name: 'A · Over image (scrim)',
  render: () => (
    <CtaA
      title="Ready when you are"
      sub="The scrim darkens the photo and flips the copy to on-dark tokens, so the band stays legible over any image."
      image={IMG}
      scrim
      actions={[
        { label: 'Book a session', href: '#' },
        { label: 'View rates', href: '#', variant: 'glass' },
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
