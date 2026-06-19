import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from './Carousel';

const meta = {
  title: 'Components/Media/Carousel',
  component: Carousel,
  parameters: {
    docs: {
      description: {
        component: 'Horizontal scroll-snap slider with arrows, dots and autoplay.',
      },
    },
  },
  argTypes: {
    perView: { control: 'number' },
    autoplay: { control: 'boolean' },
    interval: { control: 'number' },
    loop: { control: 'boolean' },
    arrows: { control: 'boolean' },
    dots: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#3b82f6'];

export const Default: Story = {
  args: {
    perView: 1,
    children: colors.map((c, i) => (
      <div
        key={i}
        style={{
          height: '12rem',
          borderRadius: '0.75rem',
          background: c,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1.5rem',
        }}
      >
        Slide {i + 1}
      </div>
    )),
  },
};
