import type { Meta, StoryObj } from '@storybook/react';
import { AnnouncementA, AnnouncementB } from './Announcement';

const meta: Meta = { title: 'Sections/Announcement bar' };
export default meta;
type Story = StoryObj;

export const A_AccentStrip: Story = { name: 'A · Accent strip + CTA', render: () => <AnnouncementA /> };
export const B_CookieBanner: Story = { name: 'B · Cookie / consent banner', render: () => <AnnouncementB /> };
