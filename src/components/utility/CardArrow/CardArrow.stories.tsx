import type { Meta, StoryObj } from '@storybook/react';
import { CardArrow } from './CardArrow';

const meta: Meta = { title: 'Components/Utility/CardArrow' };
export default meta;
type Story = StoryObj;

export const InternalAndExternal: Story = {
  name: 'Internal (→) vs external (↗) — hover to nudge',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', maxWidth: '40rem' }}>
      <a href="#" className="rdz-card rdz-card-arrow-host col sx-gap-2" style={{ position: 'relative', padding: 'var(--space-5)', textDecoration: 'none' }}>
        <CardArrow style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)' }} />
        <strong>Read the guide</strong>
        <span className="muted sx-body-s">In-site link — horizontal right arrow.</span>
      </a>
      <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="rdz-card rdz-card-arrow-host col sx-gap-2" style={{ position: 'relative', padding: 'var(--space-5)', textDecoration: 'none' }}>
        <CardArrow external style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)' }} />
        <strong>Open on GitHub</strong>
        <span className="muted sx-body-s">External link — up-right diagonal arrow.</span>
      </a>
    </div>
  ),
};
