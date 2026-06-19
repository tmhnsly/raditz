import type { Meta, StoryObj } from '@storybook/react';
import { NotFoundA } from './NotFound';

const meta: Meta = { title: 'Sections/404' };
export default meta;
type Story = StoryObj;

export const A_CenteredBigCode: Story = { name: 'A · Centered, big code', render: () => <NotFoundA /> };
