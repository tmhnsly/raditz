import type { Meta, StoryObj } from '@storybook/react';
import { BlogA, BlogB } from './Blog';

const meta: Meta = { title: 'Sections/Blog' };
export default meta;
type Story = StoryObj;

export const A_CardGrid: Story = { name: 'A · Card grid with cover', render: () => <BlogA /> };
export const B_EditorialList: Story = { name: 'B · Editorial list rows', render: () => <BlogB /> };
