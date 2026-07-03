import type { Meta, StoryObj } from '@storybook/react';
import { GalleryA, GalleryB } from './Gallery';
import { demoGallery } from '../../demos/images';

const meta: Meta = { title: 'Sections/Gallery' };
export default meta;
type Story = StoryObj;

// Captioned copy of the shared demo set for the editorial masonry variant.
const captioned = demoGallery.map((im) => ({ ...im, caption: im.alt }));

export const A_LightboxGrid: Story = {
  name: 'A · Header + lightbox grid',
  render: () => (
    <GalleryA
      eyebrow="Gallery"
      heading="Field notes from the ridge"
      lede="Six frames from a week above the treeline — open any image to browse the full set."
      images={demoGallery}
    />
  ),
};

export const B_Masonry: Story = {
  name: 'B · Masonry columns',
  render: () => (
    <GalleryB
      eyebrow="Archive"
      heading="The long way round"
      align="center"
      images={captioned}
    />
  ),
};
