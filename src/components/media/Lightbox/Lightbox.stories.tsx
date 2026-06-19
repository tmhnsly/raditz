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
  { src: 'https://picsum.photos/id/1015/1200/800', alt: 'River', caption: 'River bend' },
  { src: 'https://picsum.photos/id/1016/1200/800', alt: 'Canyon', caption: 'Canyon view' },
  { src: 'https://picsum.photos/id/1018/1200/800', alt: 'Mountains', caption: 'Mountain range' },
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
