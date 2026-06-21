import type { Meta, StoryObj } from '@storybook/react';
import { AnimationsA, AnimationsB, AnimationsC } from './Animations';

const meta: Meta = { title: 'Sections/Animations' };
export default meta;
type Story = StoryObj;

export const A_ScrollReveal: Story = {
  name: 'A · Scroll-reveal cards',
  render: () => <AnimationsA />,
};

export const B_TitleAnimations: Story = {
  name: 'B · Title animations',
  render: () => <AnimationsB />,
};

export const C_IconMotion: Story = {
  name: 'C · Animated icons',
  render: () => <AnimationsC />,
};
