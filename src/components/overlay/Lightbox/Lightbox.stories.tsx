import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Lightbox } from '../Lightbox/Lightbox';
import { demoPhotos } from '../../../demos/images';

const meta = {
  title: 'Components/Overlay/Lightbox',
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
  ...demoPhotos,
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
