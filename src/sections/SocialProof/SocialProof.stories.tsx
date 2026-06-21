import type { Meta, StoryObj } from '@storybook/react';
import { SocialProofA, SocialProofB } from './SocialProof';

const meta: Meta = { title: 'Sections/SocialProof' };
export default meta;
type Story = StoryObj;

const demoLogos = [
  { name: 'Northwind' },
  { name: 'ACME' },
  { name: 'LUMEN' },
  { name: 'Vertex' },
  { name: 'Hatch' },
];

export const A_LogoRow: Story = {
  name: 'A · Logo row',
  render: () => <SocialProofA logos={demoLogos} />,
};

export const B_HeadingLogos: Story = {
  name: 'B · Heading + logos',
  render: () => (
    <SocialProofB
      logos={demoLogos.slice(0, 4)}
      label="Trusted by teams at"
    />
  ),
};
