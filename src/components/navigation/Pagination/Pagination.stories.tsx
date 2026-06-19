import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  parameters: {
    docs: { description: { component: 'Page navigation with prev/next and ellipsised page numbers.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div style={{ padding: 24 }}>
        <Pagination total={12} page={page} onChange={setPage} />
      </div>
    );
  },
};
