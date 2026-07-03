import type { Meta, StoryObj } from '@storybook/react';
import { Auth } from './Auth';

const meta: Meta<typeof Auth> = {
  title: 'Pages/Auth',
  component: Auth,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'A centred sign-in / sign-up card built from the form primitives (Field/Input/Checkbox/Button) — the footer link flips the same card between modes.' } },
  },
};
export default meta;
type Story = StoryObj<typeof Auth>;

export const Default: Story = {};
