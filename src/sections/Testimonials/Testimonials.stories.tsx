import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialsA, TestimonialsB } from './Testimonials';

const meta: Meta = { title: 'Sections/Testimonials' };
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

export const A_QuoteCards: Story = {
  name: 'A · 3 quote cards',
  render: () => <TestimonialsA quotes={QUOTES} />,
};

export const B_SingleQuote: Story = {
  name: 'B · Single large quote',
  render: () => (
    <TestimonialsB
      heading="Customer story"
      quotes={[
        {
          quote: '"Raditz is the first design system our designers and engineers actually agree on."',
          avatar: <span className="rdz-avatar sx-tst__avatar-md">MO</span>,
          name: 'Maya Okafor',
          role: 'Design Lead, Aurora',
        },
      ]}
    />
  ),
};
