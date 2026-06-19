import type { Meta, StoryObj } from '@storybook/react';
import { MarqueeA } from './Marquee';

const meta: Meta = { title: 'Sections/Logo marquee' };
export default meta;
type Story = StoryObj;

export const A_LogoStrip: Story = { name: 'A · Auto-scrolling logo strip', render: () => <MarqueeA /> };
