import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';

const meta = {
  title: 'Components/Data/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: 'Sortable, selectable table with sticky header and optional pagination.',
      },
    },
  },
  argTypes: {
    selectable: { control: 'boolean' },
    dense: { control: 'boolean' },
    pageSize: { control: 'number' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'score', header: 'Score', align: 'right' as const, sortable: true },
];

const rows = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', score: 98 },
  { id: 2, name: 'Alan Turing', role: 'Researcher', score: 95 },
  { id: 3, name: 'Grace Hopper', role: 'Admiral', score: 99 },
];

export const Default: Story = {
  args: {
    columns,
    rows,
    defaultSort: { key: 'score', dir: 'desc' },
  },
};
