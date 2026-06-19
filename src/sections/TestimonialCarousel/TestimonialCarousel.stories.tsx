import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialCarouselA } from './TestimonialCarousel';

const meta: Meta = { title: 'Sections/Testimonial carousel' };
export default meta;
type Story = StoryObj;

export const A_ScrollSnap: Story = { name: 'A · Scroll-snap quotes (drag / swipe)', render: () => <TestimonialCarouselA /> };
