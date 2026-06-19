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
  { src: 'https://picsum.photos/id/1015/800/800', alt: 'River' },
  { src: 'https://picsum.photos/id/1016/800/800', alt: 'Canyon' },
  { src: 'https://picsum.photos/id/1018/800/800', alt: 'Mountains' },
  { src: 'https://picsum.photos/id/1020/800/800', alt: 'Bear' },
  { src: 'https://picsum.photos/id/1024/800/800', alt: 'Polar bear' },
  { src: 'https://picsum.photos/id/1025/800/800', alt: 'Pug' },
];

export const Default: Story = {
  args: {
    images,
    columns: 3,
  },
};
