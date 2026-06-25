import type { Meta, StoryObj } from '@storybook/react';
import { SpotlightA } from './Spotlight';

// BESPOKE one-shot scenes — ONE per card, each tied to its subject (don't reuse a
// scene across cards). Timed with the motion tokens (var(--duration-*) / var(--ease-*))
// so they ride `data-motion` and stay in step with the system; the Vignette owns the
// reduced-motion off-switch, so no per-scene `@media` is needed.
const DemoStyles = () => (
  <style>{`
    @keyframes spDisc { from { transform: rotate(-120deg) scale(.85); opacity: 0 } to { transform: none; opacity: 1 } }
    @keyframes spDraw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
    @keyframes spPop  { from { transform: scale(0); opacity: 0 } to { transform: none; opacity: 1 } }
    @keyframes spRise { from { transform: translateY(45%) scaleY(.35); opacity: 0 } to { transform: none; opacity: 1 } }
    .sp-disc { transform-origin: center; animation: spDisc var(--duration-slow) var(--ease-decel) 1 both; }
    .sp-band { stroke-dasharray: 1; animation: spDraw var(--duration-medium) var(--ease-decel) 1 both; }
    .sp-cup  { transform-origin: center; animation: spPop var(--duration-base) var(--ease-spring) 1 both; animation-delay: var(--duration-medium); }
    .sp-bar  { transform-origin: bottom; animation: spRise var(--duration-medium) var(--ease-decel) 1 both; }
  `}</style>
);

// Private Hire → the decks: the platter spins up to rest under a fixed tonearm.
const DeckScene = (
  <svg viewBox="0 0 80 56" width="46%" aria-hidden="true">
    <circle className="sp-disc" cx="40" cy="28" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="40" cy="28" r="4" fill="currentColor" />
    <line x1="57" y1="12" x2="45" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
// Coaching → headphones: the band draws in, then the ear-cups pop.
const HeadphonesScene = (
  <svg viewBox="0 0 80 56" width="44%" aria-hidden="true">
    <path className="sp-band" pathLength={1} d="M22 36 V27 a18 18 0 0 1 36 0 V36" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <rect className="sp-cup" x="17" y="33" width="9" height="14" rx="3" fill="currentColor" />
    <rect className="sp-cup" x="54" y="33" width="9" height="14" rx="3" fill="currentColor" />
  </svg>
);
// Courses → levels: bars rise from beginner to advanced, staggered.
const LevelsScene = (
  <svg viewBox="0 0 80 56" width="46%" aria-hidden="true">
    <rect className="sp-bar" x="22" y="30" width="9" height="16" rx="2" fill="currentColor" style={{ animationDelay: '0ms' }} />
    <rect className="sp-bar" x="36" y="22" width="9" height="24" rx="2" fill="currentColor" style={{ animationDelay: '70ms' }} />
    <rect className="sp-bar" x="50" y="14" width="9" height="32" rx="2" fill="currentColor" style={{ animationDelay: '140ms' }} />
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
          { title: 'Private Hire', text: 'Studio access on our full Pioneer setup.', href: '/services', scene: DeckScene, bg: 'gradient', tone: 'mono' },
          { title: 'Coaching', text: 'Private lessons built around your goals.', href: '/services', scene: HeadphonesScene, bg: 'secondary', tone: 'mono' },
          { title: 'Courses', text: 'Beginner to advanced, at your pace.', href: 'https://example.com', scene: LevelsScene, bg: 'aurora', tone: 'mono' },
        ]}
      />
    </>
  ),
};
