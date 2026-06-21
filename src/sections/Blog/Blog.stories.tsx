import type { Meta, StoryObj } from '@storybook/react';
import { BlogA, BlogB } from './Blog';

const meta: Meta = { title: 'Sections/Blog' };
export default meta;
type Story = StoryObj;

const demoPosts = [
  {
    title: 'Re-skinning in one line',
    href: '#',
    tag: 'Engineering',
    date: 'Jun 12',
    excerpt: 'How semantic tokens make a rebrand a one-variable change.',
    image: 'cover',
  },
  {
    title: 'The eight radius rules',
    href: '#',
    tag: 'Design',
    date: 'Jun 4',
    excerpt: 'Concentric corners and the formal↔friendly spectrum.',
    image: 'cover',
  },
  {
    title: '53 → 64 components',
    href: '#',
    tag: 'Product',
    date: 'May 28',
    excerpt: 'What shipped in the latest release and why.',
    image: 'cover',
  },
];

export const A_CardGrid: Story = {
  name: 'A · Card grid with cover',
  render: () => <BlogA posts={demoPosts} />,
};

export const B_EditorialList: Story = {
  name: 'B · Editorial list rows',
  render: () => <BlogB posts={demoPosts} />,
};
