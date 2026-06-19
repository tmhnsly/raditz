import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Search } from './Search';

const meta = {
  title: 'Components/Forms/Search',
  component: Search,
  parameters: {
    docs: { description: { component: 'The shared search input — leading icon + borderless field. Used by Combobox, CommandPalette and the explorer so every search is consistent. Pair with fuzzyFilter.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

export const Field: Story = {
  render: () => {
    const [q, setQ] = useState('');
    return (
      <div style={{ padding: 24, maxWidth: 340 }}>
        <Search value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search components…" />
      </div>
    );
  },
};

export const Plain: Story = {
  render: () => {
    const [q, setQ] = useState('');
    return (
      <div style={{ padding: 24, maxWidth: 340, border: '1px solid var(--surface-edge)', borderRadius: 'var(--radius-overlay)' }}>
        <Search variant="plain" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a command…" hint={<kbd className="srx-kbd">esc</kbd>} />
      </div>
    );
  },
};
