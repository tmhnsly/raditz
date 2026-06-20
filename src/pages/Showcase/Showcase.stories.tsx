import type { Meta, StoryObj } from '@storybook/react';
import { Showcase } from './Showcase';

const meta: Meta<typeof Showcase> = {
  title: 'Pages/Showcase',
  component: Showcase,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A full-bleed, scroll-through page that exercises the section backgrounds — a photo hero bleed, gradient bands, and a mid-page photo band. The floating switch flips every backdrop between static and parallax so you can compare the scroll behaviour live.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Showcase>;

export const Default: Story = {};
