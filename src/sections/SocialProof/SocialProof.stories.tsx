import type { Meta, StoryObj } from '@storybook/react';
import { SocialProofA, SocialProofB } from './SocialProof';

const meta: Meta = { title: 'Sections/SocialProof' };
export default meta;
type Story = StoryObj;

export const A_LogoRow: Story = { name: 'A · Logo row', render: () => <SocialProofA /> };
export const B_HeadingLogos: Story = { name: 'B · Heading + logos', render: () => <SocialProofB /> };
