import type { Meta, StoryObj } from '@storybook/react';
import { Article } from './Article';

const meta: Meta<typeof Article> = {
  title: 'Pages/Article',
  component: Article,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A long-form editorial page: glass Navbar, a titled header with byline + cover, and a Prose body (drop-in for Markdown/CMS HTML), closed by the Footer.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Article>;

export const Default: Story = {};
