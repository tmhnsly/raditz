// API contract gate: every public COMPONENT must pass a consumer `className`
// through to its rendered root element (the standard rest-passthrough contract).
// Table-driven over the whole barrel so a new component is gated automatically.
import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as Raditz from './index';

const SENTINEL = 'rdz-api-contract-sentinel';

/** Minimal props for components whose render needs them (beyond className). */
const MINIMAL_PROPS: Record<string, Record<string, unknown>> = {
  // data
  BarChart: { data: [{ label: 'a', value: 1 }] },
  LineChart: { data: [{ y: 1 }, { y: 2 }] },
  ScatterChart: { data: [{ x: 1, y: 2 }] },
  Sparkline: { data: [1, 2, 3] }, // returns null under 2 points
  // display / typography / motion / navigation
  CountUp: { value: 42 },
  Icon: { name: 'search' },
  CheckList: { items: ['one'] },
  TextReveal: { text: 'Hello' },
  Tree: { items: [{ id: 'a', label: 'A' }] },
  // overlays render nothing when closed — mount them open
  AlertDialog: { defaultOpen: true, title: 'T', description: 'D' },
  Dialog: { defaultOpen: true, title: 'T' },
  Drawer: { defaultOpen: true, title: 'T' },
  Popover: { defaultOpen: true, trigger: 'open', children: 'content' },
  DropdownMenu: { defaultOpen: true, trigger: 'open', items: [{ label: 'Item' }] },
  ContextMenu: { defaultOpen: true, items: [{ label: 'Item' }], children: 'target' },
  HoverCard: { defaultOpen: true, trigger: 'open', children: 'content' },
  Menubar: { defaultOpen: true, menus: [{ label: 'File', items: [{ label: 'New' }] }] },
  CommandPalette: { defaultOpen: true, items: [{ label: 'Item' }] },
  Lightbox: { defaultOpen: true, images: [{ src: 'a.png', alt: 'a' }] },
  // section helpers (lib)
  SectionHeader: { heading: 'Heading' },
  TestimonialFigure: { person: { name: 'Ada' } },
  SectionActionButton: { action: { label: 'Go', href: '#' } },
  SectionActions: { actions: [{ label: 'Go', href: '#' }] },
};

/** Sections take no className by design (SectionBaseProps carries content +
 *  backdrop only) — the rest-passthrough contract doesn't apply to them. */
const SECTION_SKIP_REASON = 'content-driven section: SectionBaseProps has no className API';
const SECTIONS = [
  'AnimationsA', 'AnimationsB', 'AnimationsC', 'AnimationsD',
  'AnnouncementA', 'AnnouncementB', 'BlogA', 'BlogB', 'ComparisonA',
  'CtaA', 'CtaB', 'FaqA', 'FaqB', 'FeaturesA', 'FeaturesB', 'FeaturesC',
  'FeaturesTabbed', 'FooterA', 'FooterB', 'HeroA', 'HeroB', 'HeroC',
  'ImageFocus', 'MarqueeA', 'NavbarA', 'NavbarB', 'NavbarC', 'NavbarD',
  'NewsletterA', 'NotFoundA', 'PricingA', 'PricingB', 'SocialProofA',
  'SocialProofB', 'SpotlightA', 'StatsA', 'StatsB', 'TeamA',
  'TestimonialCarouselA', 'TestimonialsA', 'TestimonialsB',
];

/** Components excluded from the gate — each with a one-line reason. */
const SKIP: Record<string, string> = {
  ...Object.fromEntries(SECTIONS.map((s) => [s, SECTION_SKIP_REASON])),
  HeroBleed: 'section preset: SectionVariantProps has no className API (wrap/nav slots instead)',
  SectionShell: 'no single className prop by design (wrap / padClassName / frameClassName instead)',
  ThemePicker: 'takes no props at all — fixed-class panel, no className API',
};

const isComponentExport = (name: string, value: unknown): boolean => {
  if (!/^[A-Z]/.test(name)) return false; // hooks/utils are lowercase
  if (name === name.toUpperCase()) return false; // ALL-CAPS data consts (ICONS, ACCENTS, …)
  if (typeof value === 'function') return true; // plain function components
  // forwardRef/memo components are exotic objects carrying $$typeof
  return typeof value === 'object' && value !== null && '$$typeof' in value;
};

const components = Object.entries(Raditz).filter(([name, value]) => isComponentExport(name, value));

describe('public API contract: className reaches the rendered root', () => {
  it('found a meaningful component surface', () => {
    expect(components.length).toBeGreaterThan(50);
  });

  for (const [name, value] of components) {
    if (name in SKIP) {
      it.skip(`${name} — skipped: ${SKIP[name]}`, () => {});
      continue;
    }
    it(name, () => {
      const C = value as React.ComponentType<Record<string, unknown>>;
      const props = MINIMAL_PROPS[name] ?? {};
      render(<C className={SENTINEL} {...props} />);
      // Search the whole document (not just the container) so portalled
      // components pass too.
      expect(document.getElementsByClassName(SENTINEL).length).toBeGreaterThan(0);
    });
  }
});
