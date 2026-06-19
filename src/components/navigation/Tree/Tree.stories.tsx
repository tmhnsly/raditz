import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tree, type TreeNode } from './Tree';

const meta = {
  title: 'Components/Navigation/Tree',
  component: Tree,
  parameters: {
    docs: {
      description: {
        component:
          'An accessible, file-browser-style tree view (WAI-ARIA `tree` pattern). Folders toggle open/closed on click; selection and expansion are controllable or uncontrolled. Keyboard: ↑/↓ move, →/← expand/collapse, Enter/Space select, Home/End jump.',
      },
    },
  },
} satisfies Meta<typeof Tree>;
export default meta;
type Story = StoryObj<typeof Tree>;

const files: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'src/components',
        label: 'components',
        children: [
          { id: 'src/components/button.tsx', label: 'button.tsx', meta: '2kb' },
          { id: 'src/components/tree.tsx', label: 'tree.tsx', meta: '6kb' },
        ],
      },
      {
        id: 'src/lib',
        label: 'lib',
        children: [{ id: 'src/lib/utils.ts', label: 'utils.ts', meta: '1kb' }],
      },
      { id: 'src/index.ts', label: 'index.ts', meta: '0.3kb' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [{ id: 'public/favicon.svg', label: 'favicon.svg', meta: '1kb' }],
  },
  { id: 'readme', label: 'README.md', meta: '4kb' },
  { id: 'pkg', label: 'package.json', meta: '1kb', disabled: true },
];

export const Default: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Tree
        aria-label="Project files"
        items={files}
        defaultExpandedIds={['src', 'src/components']}
        defaultSelectedId="src/components/tree.tsx"
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [selected, setSelected] = useState('src/index.ts');
    const [expanded, setExpanded] = useState<string[]>(['src']);
    return (
      <div style={{ display: 'grid', gap: '1rem', width: 280 }}>
        <Tree
          aria-label="Project files"
          items={files}
          selectedId={selected}
          onSelect={setSelected}
          expandedIds={expanded}
          onExpandedChange={setExpanded}
        />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          selected: {selected}
        </p>
      </div>
    );
  },
};
