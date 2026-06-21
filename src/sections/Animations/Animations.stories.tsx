import type { Meta, StoryObj } from '@storybook/react';
import { AnimationsA, AnimationsB, AnimationsC, AnimationsD } from './Animations';

const meta: Meta = { title: 'Sections/Animations' };
export default meta;
type Story = StoryObj;

export const A_ScrollReveal: Story = {
  name: 'A · Scroll-reveal + Replay',
  render: () => <AnimationsA />,
};

export const B_TitleAndText: Story = {
  name: 'B · Title & text animations',
  render: () => <AnimationsB />,
};

export const C_IconMotion: Story = {
  name: 'C · Animated icons',
  render: () => <AnimationsC />,
};

export const D_PresetCards: Story = {
  name: 'D · MotionCard presets',
  render: () => <AnimationsD />,
};
