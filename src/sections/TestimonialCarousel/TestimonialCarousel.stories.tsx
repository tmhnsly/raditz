import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialCarouselA } from './TestimonialCarousel';

const meta: Meta = { title: 'Sections/Testimonial carousel' };
export default meta;
type Story = StoryObj;

const QUOTES = [
  {
    quote: '"We re-skinned our entire app for a rebrand in an afternoon. One token."',
    avatar: <span className="rdz-avatar sx-avatar-sm">MO</span>,
    name: 'Maya Okafor',
    role: 'Design Lead, Aurora',
  },
  {
    quote: '"The component coverage is unreal. We deleted our internal UI kit."',
    avatar: <span className="rdz-avatar sx-avatar-sm">JT</span>,
    name: 'Jon Tran',
    role: 'Eng Manager, Vertex',
  },
  {
    quote: '"Accessible by default saved us weeks of audit work."',
    avatar: <span className="rdz-avatar sx-avatar-sm">SL</span>,
    name: 'Sara Lin',
    role: 'PM, Lumen',
  },
];

export const A_ScrollSnap: Story = {
  name: 'A · Scroll-snap quotes (drag / swipe)',
  render: () => <TestimonialCarouselA quotes={QUOTES} />,
};
