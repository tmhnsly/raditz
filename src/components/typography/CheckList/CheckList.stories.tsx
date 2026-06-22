import type { Meta, StoryObj } from '@storybook/react';
import { CheckList } from './CheckList';

const meta: Meta<typeof CheckList> = { title: 'Typography/CheckList', component: CheckList };
export default meta;
type Story = StoryObj<typeof CheckList>;

const ITEMS = ['4× Pioneer CDJ-3000', 'DJM-A9 / V10 mixer', 'Martin Audio system', 'RMX-1000 effects', 'Studio lighting rig', 'Hands-on support'];

export const Default: Story = { args: { items: ITEMS } };
export const TwoColumn: Story = { args: { items: ITEMS, columns: 2 } };
export const DotMarker: Story = { args: { items: ITEMS.slice(0, 3), marker: 'dot' } };
