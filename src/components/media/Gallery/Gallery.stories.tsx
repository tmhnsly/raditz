import type { Meta, StoryObj } from '@storybook/react';
import { Gallery } from './Gallery';

const meta = {
  title: 'Components/Media/Gallery',
  component: Gallery,
  parameters: {
    docs: {
      description: {
        component: 'Responsive thumbnail grid that opens a Lightbox on click.',
      },
    },
  },
  argTypes: {
    columns: { control: 'number' },
    gap: { control: 'text' },
    aspect: { control: 'text' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const images = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=70', alt: 'Mountain range' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=70', alt: 'Forest canopy' },
  { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=70', alt: 'Foggy forest' },
  { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=70', alt: 'Lake and mountains' },
  { src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=70', alt: 'Waterfall' },
  { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=70', alt: 'Forest path' },
];

export const Default: Story = {
  args: {
    images,
    columns: 3,
  },
};
