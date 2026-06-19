import type { Meta, StoryObj } from '@storybook/react';
import { FaqA, FaqB } from './Faq';

const meta: Meta = { title: 'Sections/FAQ' };
export default meta;
type Story = StoryObj;

export const A_Accordion: Story = { name: 'A · Accordion', render: () => <FaqA /> };
export const B_TwoColumn: Story = { name: 'B · 2-column list', render: () => <FaqB /> };
