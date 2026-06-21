import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Lightbox } from '../Lightbox/Lightbox';

const meta = {
  title: 'Components/Media/Lightbox',
  component: Lightbox,
  parameters: {
    docs: {
      description: {
        component: 'Full-screen image viewer with arrows, swipe, zoom and a filmstrip.',
      },
    },
  },
  argTypes: {
    filmstrip: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const images = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=75', alt: 'Mountains', caption: 'Mountain range' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=75', alt: 'Foggy forest', caption: 'Morning fog' },
  { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=75', alt: 'Lake', caption: 'Alpine lake' },
];

export const Default: Story = {
  args: {
    filmstrip: true,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <button type="button" onClick={() => setOpen(true)}>
          Open lightbox
        </button>
        <Lightbox {...args} images={images} open={open} onOpenChange={setOpen} />
      </div>
    );
  },
};
