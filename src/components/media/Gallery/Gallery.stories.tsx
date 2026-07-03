import type { Meta, StoryObj } from '@storybook/react';
import { Gallery } from './Gallery';
import { demoGallery } from '../../../demos/images';

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

const images = demoGallery;

export const Default: Story = {
  args: {
    images,
    columns: 3,
  },
};
