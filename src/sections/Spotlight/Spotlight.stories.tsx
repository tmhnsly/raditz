import type { Meta, StoryObj } from '@storybook/react';
import { SpotlightA } from './Spotlight';

// One-shot demo scenes (real apps supply bespoke, service-specific scenes).
const DemoStyles = () => (
  <style>{`
    @keyframes spDisc { from { transform: rotate(-90deg) scale(.7); opacity: .4 } to { transform: rotate(0) scale(1); opacity: 1 } }
    @keyframes spRise { from { transform: translateY(35%) scaleY(.4); opacity: 0 } to { transform: none; opacity: 1 } }
    .sp-disc { transform-origin: center; animation: spDisc .9s cubic-bezier(.2,.8,.2,1) 1 both; }
    .sp-bar  { transform-origin: bottom; animation: spRise .7s ease-out 1 both; }
    @media (prefers-reduced-motion: reduce) { .sp-disc, .sp-bar { animation: none; } }
  `}</style>
);

const DiscScene = (
  <svg className="sp-demo" viewBox="0 0 80 56" width="46%" aria-hidden="true">
    <circle className="sp-disc" cx="40" cy="28" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="40" cy="28" r="4" fill="currentColor" />
  </svg>
);
const BarsScene = (
  <svg className="sp-demo" viewBox="0 0 80 56" width="46%" aria-hidden="true">
    <rect className="sp-bar" x="22" y="30" width="9" height="16" rx="2" fill="currentColor" style={{ animationDelay: '0ms' }} />
    <rect className="sp-bar" x="36" y="22" width="9" height="24" rx="2" fill="currentColor" style={{ animationDelay: '90ms' }} />
    <rect className="sp-bar" x="50" y="14" width="9" height="32" rx="2" fill="currentColor" style={{ animationDelay: '180ms' }} />
  </svg>
);

const meta: Meta<typeof SpotlightA> = { title: 'Sections/Spotlight', component: SpotlightA };
export default meta;
type Story = StoryObj<typeof SpotlightA>;

export const Default: Story = {
  render: () => (
    <>
      <DemoStyles />
      <SpotlightA
        eyebrow="What we offer"
        heading="Animated thumbnail cards"
        items={[
          { title: 'Private Hire', text: 'Studio access on our full Pioneer setup.', href: '/services', scene: DiscScene, bg: 'gradient', tone: 'mono' },
          { title: 'Coaching', text: 'Private lessons built around your goals.', href: '/services', scene: BarsScene, bg: 'secondary', tone: 'mono' },
          { title: 'Courses', text: 'Beginner to advanced, at your pace.', href: 'https://example.com', scene: BarsScene, bg: 'aurora', tone: 'mono' },
        ]}
      />
    </>
  ),
};
