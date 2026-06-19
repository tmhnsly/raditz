import type { Meta, StoryObj } from '@storybook/react';
import { NewsletterA } from './Newsletter';

const meta: Meta = { title: 'Sections/Newsletter' };
export default meta;
type Story = StoryObj;

export const A_CardSignup: Story = { name: 'A · Card signup', render: () => <NewsletterA /> };
