import type { Meta, StoryObj } from '@storybook/react';
import { Docs } from './Docs';

const meta: Meta<typeof Docs> = {
  title: 'Pages/Docs',
  component: Docs,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'A documentation page: AppShell sidebar (Tree nav + search) around a Prose article with a sticky on-page table of contents.' } },
  },
};
export default meta;
type Story = StoryObj<typeof Docs>;

export const Default: Story = {};
