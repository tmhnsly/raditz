import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { GiMoonOrbit } from 'react-icons/gi';
import { AppShell } from './AppShell';
import { Tree, type TreeNode } from '../../navigation/Tree';
import { Search } from '../../inputs/Search';
import { IconButton } from '../../actions/IconButton';

const meta: Meta = { title: 'Pages/App shell' };
export default meta;
type Story = StoryObj;

const NAV: TreeNode[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects', children: [
    { id: 'projects/active', label: 'Active', meta: 8 },
    { id: 'projects/archived', label: 'Archived', meta: 31 },
  ] },
  { id: 'team', label: 'Team', children: [
    { id: 'team/people', label: 'People' },
    { id: 'team/roles', label: 'Roles' },
  ] },
  { id: 'settings', label: 'Settings' },
];

const MARK: CSSProperties = { width: '1.6rem', height: '1.6rem', display: 'inline-grid', placeItems: 'center', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: 'var(--on-accent)' };

export const Default: Story = {
  name: 'Dashboard (sidebar + search + breadcrumbs)',
  render: () => {
    const [sel, setSel] = useState('projects/active');
    const crumb = sel.split('/').map((s) => s[0].toUpperCase() + s.slice(1)).join(' / ');
    return (
      <div style={{ height: '36rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--surface-edge)' }}>
        <AppShell
          brand={<><span style={MARK}><GiMoonOrbit /></span>Acme</>}
          search={<Search size="sm" placeholder="Search…" />}
          nav={(
            <Tree
              items={NAV}
              selectedId={sel}
              defaultExpandedIds={['projects', 'team']}
              onSelect={(id, node) => { if (!node.children?.length) setSel(id); }}
              toggleOnRowClick={false}
              aria-label="App navigation"
            />
          )}
          breadcrumbs={<span style={{ fontSize: 'var(--fs-body-s)', color: 'var(--text-soft)' }}>{crumb}</span>}
          actions={<><IconButton variant="ghost" icon="bell" aria-label="Notifications" /><IconButton variant="soft" icon="user" aria-label="Account" /></>}
          collapsible
          footer={<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--fs-body-s)' }}><span style={{ ...MARK, fontSize: '0.75rem', fontWeight: 700 }}>A</span>Ada Lovelace</div>}
        >
          <h1 className="h-section">{sel.split('/').pop()}</h1>
          <p className="muted" style={{ marginTop: 'var(--space-2)' }}>
            Sidebar leaves update the content; folders just open. The bar holds breadcrumbs +
            actions; the panel button collapses the sidebar, and on a narrow screen it becomes
            an off-canvas drawer.
          </p>
        </AppShell>
      </div>
    );
  },
};

export const RightCompact: Story = {
  name: 'Right sidebar · compact density',
  render: () => {
    const [sel, setSel] = useState('team/people');
    return (
      <div style={{ height: '32rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--surface-edge)' }}>
        <AppShell
          side="right"
          density="compact"
          railWidth="13rem"
          brand={<><span style={MARK}><GiMoonOrbit /></span>Acme</>}
          nav={(
            <Tree
              items={NAV}
              selectedId={sel}
              defaultExpandedIds={['projects', 'team']}
              onSelect={(id, node) => { if (!node.children?.length) setSel(id); }}
              toggleOnRowClick={false}
              aria-label="App navigation"
            />
          )}
          breadcrumbs={<span style={{ fontSize: 'var(--fs-body-s)', color: 'var(--text-soft)' }}>Team / People</span>}
        >
          <h1 className="h-section">People</h1>
          <p className="muted" style={{ marginTop: 'var(--space-2)' }}>Compact density, sidebar on the right.</p>
        </AppShell>
      </div>
    );
  },
};

export const TopBar: Story = {
  name: 'Top-bar layout (docs/marketing) — same nav data',
  render: () => (
    <div style={{ height: '30rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--surface-edge)' }}>
      <AppShell
        layout="topbar"
        brand={<><span style={MARK}><GiMoonOrbit /></span>Acme</>}
        nav={NAV.map((n) => (
          <a key={n.id} href="#" style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-control)', color: 'var(--text-soft)', fontSize: 'var(--fs-body-s)', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>{n.label}</a>
        ))}
        search={<Search size="sm" placeholder="Search…" />}
        actions={<IconButton variant="soft" icon="user" aria-label="Account" />}
        breadcrumbs={<span style={{ fontSize: 'var(--fs-body-s)', color: 'var(--text-soft)' }}>Docs / Getting started</span>}
      >
        <h1 className="h-section">Getting started</h1>
        <p className="muted" style={{ marginTop: 'var(--space-2)' }}>The same NAV data as the sidebar stories — swapped into a horizontal top-bar layout.</p>
      </AppShell>
    </div>
  ),
};
