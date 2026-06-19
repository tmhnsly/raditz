import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialsA, TestimonialsB } from './Testimonials';

const meta: Meta = { title: 'Sections/Testimonials' };
export default meta;
type Story = StoryObj;

export const A_QuoteCards: Story = { name: 'A · 3 quote cards', render: () => <TestimonialsA /> };
export const B_SingleQuote: Story = { name: 'B · Single large quote', render: () => <TestimonialsB /> };
