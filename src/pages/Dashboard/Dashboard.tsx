import { useState } from 'react';
import type { CSSProperties } from 'react';
import { GiMoonOrbit } from 'react-icons/gi';
import { AppShell } from '../../components/layout/AppShell';
import { Tree, type TreeNode } from '../../components/navigation/Tree';
import { Search } from '../../components/inputs/Search';
import { IconButton } from '../../components/actions/IconButton';
import { Tabs } from '../../components/navigation/Tabs';
import { Card } from '../../components/surfaces/Card';
import { Badge } from '../../components/display/Badge';
import { CountUp } from '../../components/display/CountUp';
import { Sparkline } from '../../components/data/Sparkline';
import { LineChart } from '../../components/data/LineChart';
import { Donut } from '../../components/data/Donut';
import { BarChart } from '../../components/data/BarChart';
import { Legend } from '../../components/data/Legend';
import { DataTable, type DataTableColumn } from '../../components/data/DataTable';

const NAV: TreeNode[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics', children: [
    { id: 'analytics/traffic', label: 'Traffic', meta: 4 },
    { id: 'analytics/revenue', label: 'Revenue' },
  ] },
  { id: 'customers', label: 'Customers', children: [
    { id: 'customers/all', label: 'All' },
    { id: 'customers/segments', label: 'Segments' },
  ] },
  { id: 'settings', label: 'Settings' },
];

const BRAND: CSSProperties = { width: '1.6rem', height: '1.6rem', display: 'inline-grid', placeItems: 'center', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: 'var(--on-accent)' };

type Kpi = { label: string; value: string; delta: string; up: boolean; spark: number[] };
const KPIS: Kpi[] = [
  { label: 'Revenue', value: '$48.2k', delta: '+12.4%', up: true, spark: [8, 10, 9, 12, 14, 13, 17, 19] },
  { label: 'Active users', value: '3,204', delta: '+4.1%', up: true, spark: [30, 28, 33, 31, 35, 40, 38, 44] },
  { label: 'Conversion', value: '2.8%', delta: '−0.3%', up: false, spark: [4, 5, 4, 4, 3, 4, 3, 3] },
  { label: 'Churn', value: '1.1%', delta: '−0.2%', up: true, spark: [3, 3, 2, 3, 2, 2, 2, 1] },
];

const THIS_YEAR = [42, 48, 45, 52, 60, 58, 66, 71, 68, 74, 80, 86];
const LAST_YEAR = [30, 36, 34, 40, 44, 47, 52, 55, 58, 61, 64, 68];
const CHANNELS = [
  { label: 'Direct', value: 42, color: 'var(--accent)' },
  { label: 'Referral', value: 28, color: 'var(--warning)' },
  { label: 'Social', value: 18, color: 'var(--info, var(--accent))' },
  { label: 'Email', value: 12, color: 'var(--danger)' },
];
const TOP_PAGES = [
  { label: '/pricing', value: 1820 },
  { label: '/features', value: 1440 },
  { label: '/blog/launch', value: 980 },
  { label: '/docs', value: 760 },
];

type OrderRow = { id: string; customer: string; plan: string; mrr: string; status: 'Active' | 'Trialing' | 'Past due' };
const ORDERS: OrderRow[] = [
  { id: '1', customer: 'Acme Inc.', plan: 'Business', mrr: '$240', status: 'Active' },
  { id: '2', customer: 'Globex', plan: 'Pro', mrr: '$96', status: 'Trialing' },
  { id: '3', customer: 'Initech', plan: 'Business', mrr: '$240', status: 'Past due' },
  { id: '4', customer: 'Umbrella', plan: 'Pro', mrr: '$96', status: 'Active' },
  { id: '5', customer: 'Hooli', plan: 'Enterprise', mrr: '$620', status: 'Active' },
];
const STATUS_TONE = { Active: 'success', Trialing: 'info', 'Past due': 'danger' } as const;
const ORDER_COLS: DataTableColumn<OrderRow>[] = [
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'plan', header: 'Plan', sortable: true },
  { key: 'mrr', header: 'MRR', align: 'right', sortable: true, sortValue: (r) => Number(r.mrr.replace(/[^0-9.]/g, '')) },
  { key: 'status', header: 'Status', render: (_v, r) => <Badge variant="soft" color={STATUS_TONE[r.status]}>{r.status}</Badge> },
];

/**
 * Dashboard — a full analytics app page composed from Raditz: AppShell (sidebar +
 * search + breadcrumbs) around a KPI row, a primary trend chart with a Legend and
 * a period toggle, a channel-breakdown Donut, a top-pages BarChart, and a
 * customers DataTable. Everything reads the same tokens, so the Theme toolbar
 * re-themes the whole surface — charts included.
 */
export function Dashboard() {
  const [period, setPeriod] = useState('30d');
  const [sel, setSel] = useState('overview');

  return (
    <div className="rdz-page">
      <AppShell
        brand={<><span style={BRAND}><GiMoonOrbit /></span>Raditz</>}
        search={<Search size="sm" placeholder="Search…" />}
        nav={(
          <Tree
            items={NAV}
            selectedId={sel}
            defaultExpandedIds={['analytics', 'customers']}
            onSelect={(id, node) => { if (!node.children?.length) setSel(id); }}
            toggleOnRowClick={false}
            aria-label="Dashboard navigation"
          />
        )}
        breadcrumbs={<span className="dash__crumb">Analytics / Overview</span>}
        actions={<><IconButton variant="ghost" icon="bell" aria-label="Notifications" /><IconButton variant="soft" icon="user" aria-label="Account" /></>}
        collapsible
        footer={<div className="dash__user"><span style={{ ...BRAND, fontSize: '0.75rem', fontWeight: 700 }}>A</span>Ada Lovelace</div>}
      >
        <div className="dash">
          <header className="dash__head">
            <div>
              <h1 className="h-section">Overview</h1>
              <p className="muted dash__sub">How the product is performing this period.</p>
            </div>
            <Tabs
              value={period}
              onValueChange={setPeriod}
              tabs={[{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days' }]}
            />
          </header>

          <section className="dash__kpis" aria-label="Key metrics">
            {KPIS.map((k) => (
              <Card key={k.label} className="dash__kpi">
                <div className="dash__kpi-top">
                  <span className="dash__kpi-label">{k.label}</span>
                  <Badge variant="soft" color={k.up ? 'success' : 'danger'}>{k.delta}</Badge>
                </div>
                <CountUp className="dash__kpi-value" value={k.value} />
                <Sparkline data={k.spark} color={k.up ? 'var(--accent)' : 'var(--danger)'} />
              </Card>
            ))}
          </section>

          <section className="dash__grid">
            <Card className="dash__panel dash__panel--wide">
              <div className="dash__panel-head">
                <h2 className="dash__panel-title">Revenue trend</h2>
                <Legend size="sm" items={[
                  { label: 'This year', color: 'var(--accent)', shape: 'line' },
                  { label: 'Last year', color: 'var(--warning)', shape: 'line' },
                ]} />
              </div>
              <LineChart
                height={260}
                formatY={(v) => `$${v}k`}
                series={[
                  { name: 'This year', color: 'var(--accent)', data: THIS_YEAR.map((y, i) => ({ y, label: `Month ${i + 1}` })) },
                  { name: 'Last year', color: 'var(--warning)', data: LAST_YEAR.map((y, i) => ({ y, label: `Month ${i + 1}` })) },
                ]}
              />
            </Card>

            <Card className="dash__panel">
              <div className="dash__panel-head">
                <h2 className="dash__panel-title">Channels</h2>
              </div>
              <div className="dash__donut">
                <Donut size="8.5rem" thickness={14} segments={CHANNELS} label={<div className="dash__donut-mid"><strong>100%</strong><span>traffic</span></div>} />
                <Legend size="sm" items={CHANNELS.map((c) => ({ label: c.label, color: c.color, shape: 'square' }))} />
              </div>
            </Card>
          </section>

          <section className="dash__grid">
            <Card className="dash__panel dash__panel--wide">
              <div className="dash__panel-head">
                <h2 className="dash__panel-title">Recent customers</h2>
                <a className="dash__link" href="#">View all</a>
              </div>
              <DataTable rowKey="id" columns={ORDER_COLS} rows={ORDERS} />
            </Card>

            <Card className="dash__panel">
              <div className="dash__panel-head">
                <h2 className="dash__panel-title">Top pages</h2>
              </div>
              <BarChart horizontal data={TOP_PAGES} />
            </Card>
          </section>
        </div>
      </AppShell>
    </div>
  );
}
