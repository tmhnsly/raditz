/// <reference types="vite/client" />
// API contract gate: a consumer `className` must reach the document from every
// public component AND section (the rest-passthrough contract). Two passes:
//
// 1. STORY PASS — every composed story of every public component/section renders
//    with a sentinel className merged into its args, so each story-rendered STATE
//    is gated (a component that drops className only in some state fails here).
//    Stories whose `render` declares no parameter provably cannot receive an args
//    override — that mechanical fact is detected in code (not a hand list) and
//    those stories are skipped by name. SKIP_STORIES stays for any residue.
//
// 2. COMPONENT FLOOR — every component export of the barrel gets a minimal mount
//    with the sentinel (55 of ~90 story modules are fully args-blind, so the
//    story pass alone would leave those components ungated). Sections mount via
//    their `children` body-override slot; FLOOR_PROPS carries only per-component
//    render facts (returns null while closed / requires data to paint).
//
// The story globs mirror scripts/public-surface.mjs like a11y.test.tsx does
// (kept in sync by scripts/a11y-surface.test.mjs).
import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as Raditz from './index';

const SENTINEL = 'rdz-api-contract-sentinel';

type CSFModule = Parameters<typeof composeStories>[0];
type StoryModule = { default?: { render?: (...a: unknown[]) => unknown } } & Record<
  string,
  { render?: (...a: unknown[]) => unknown } | undefined
>;

const storyModules = {
  ...import.meta.glob('./components/**/*.stories.tsx', { eager: true }),
  ...import.meta.glob('./sections/**/*.stories.tsx', { eager: true }),
};

/** Per-STORY skips — `path :: story` → a per-story fact that makes the className
 *  override unreachable there (beyond the mechanically-detected zero-param
 *  render() case, which needs no entry). Staleness-guarded below. */
const SKIP_STORIES: Record<string, string> = {
  'components/overlay/Lightbox/Lightbox.stories.tsx :: Default':
    'mounts CLOSED behind a trigger button (open state lives in the story) — the overlay renders nothing until interaction, so no className can reach the document; the floor pass gates Lightbox open',
};

describe('API contract (story pass): className reaches the document from every args-capable story', () => {
  const allKeys = new Set<string>();
  for (const [p, mod] of Object.entries(storyModules)) {
    const composed = composeStories(mod as CSFModule);
    const raw = mod as StoryModule;
    for (const [storyName, Story] of Object.entries(composed) as [
      string,
      React.ComponentType<Record<string, unknown>> & { args?: Record<string, unknown> },
    ][]) {
      const key = `${p.replace('./', '')} :: ${storyName}`;
      allKeys.add(key);
      // A story-level (or meta-level) render() that declares no parameter can
      // never see an args override — provable from the function's arity.
      const renderFn = raw[storyName]?.render ?? raw.default?.render;
      if (typeof renderFn === 'function' && renderFn.length === 0) {
        it.skip(`${key} — skipped: render() declares no args parameter (args-blind; floor pass covers the component)`, () => {});
        continue;
      }
      if (key in SKIP_STORIES) {
        it.skip(`${key} — skipped: ${SKIP_STORIES[key]}`, () => {});
        continue;
      }
      it(key, () => {
        // Merge, don't clobber: keep a load-bearing story className if one exists.
        const merged = [Story.args?.className, SENTINEL].filter(Boolean).join(' ');
        render(<Story className={merged} />);
        // Search the whole document (not just the container) so portalled
        // components pass too.
        expect(document.getElementsByClassName(SENTINEL).length).toBeGreaterThan(0);
      });
    }
  }

  it('SKIP_STORIES keys all still correspond to existing stories (staleness guard)', () => {
    for (const key of Object.keys(SKIP_STORIES)) {
      expect(allKeys.has(key), `${key} no longer exists — drop it from SKIP_STORIES`).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Component floor
// ---------------------------------------------------------------------------

/** Every non-story/test section source module — used to tell section exports
 *  apart from component exports (sections mount via their `children` override). */
const sectionModules = import.meta.glob(
  ['./sections/**/*.tsx', '!./sections/**/*.stories.tsx', '!./sections/**/*.test.tsx'],
  { eager: true },
);

const isComponentExport = (name: string, value: unknown): boolean => {
  if (!/^[A-Z]/.test(name)) return false; // hooks/utils are lowercase
  if (name === name.toUpperCase()) return false; // ALL-CAPS data consts (ICONS, ACCENTS, …)
  if (typeof value === 'function') return true; // plain function components
  // forwardRef/memo components are exotic objects carrying $$typeof
  return typeof value === 'object' && value !== null && '$$typeof' in value;
};

const sectionExports = new Set(
  Object.values(sectionModules).flatMap((m) =>
    Object.entries(m as Record<string, unknown>)
      .filter(([n, v]) => isComponentExport(n, v))
      .map(([n]) => n),
  ),
);

/** Per-component RENDER FACTS only — props without which the component paints
 *  nothing (so the sentinel could never appear). Not a bookkeeping table: an
 *  entry is justified solely by "returns null / throws without this". */
const FLOOR_PROPS: Record<string, Record<string, unknown>> = {
  // data — charts need data points to paint
  BarChart: { data: [{ label: 'a', value: 1 }] },
  LineChart: { data: [{ y: 1 }, { y: 2 }] },
  ScatterChart: { data: [{ x: 1, y: 2 }] },
  Sparkline: { data: [1, 2, 3] }, // returns null under 2 points
  Legend: { items: [{ label: 'A' }] }, // maps items eagerly
  // display / typography / motion / navigation — required content props
  CountUp: { value: 42 },
  Icon: { name: 'search' },
  CheckList: { items: ['one'] },
  TextReveal: { text: 'Hello' },
  Tree: { items: [{ id: 'a', label: 'A' }] },
  Timeline: { items: [{ title: 'A' }] }, // maps items eagerly
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
  BottomSheet: { defaultOpen: true, title: 'T' },
  // sections that eagerly read their required content array BEFORE the
  // `children` body-override short-circuits — an empty array satisfies the
  // eager access (finding: the children escape hatch doesn't shield a missing
  // required array in these five)
  FeaturesA: { items: [] },
  FeaturesB: { items: [] },
  FeaturesTabbed: { items: [] },
  PricingB: { tiers: [] },
  TestimonialsB: { quotes: [] },
  HowItWorksB: { items: [] },
  // section helpers (lib) — return null without their content prop
  SectionHeader: { heading: 'Heading' },
  TestimonialFigure: { person: { name: 'Ada' } },
  SectionActionButton: { action: { label: 'Go', href: '#' } },
  SectionActions: { actions: [{ label: 'Go', href: '#' }] },
};

/** Components excluded from the floor — each a verified per-component API fact. */
const FLOOR_SKIP: Record<string, string> = {
  HeroBleed: 'section preset: HeroBleedProps has no className API (wrap/nav slots instead)',
  ThemePicker: 'takes no props at all — fixed-class panel, no className API',
  NavbarD: 'bottom tab bar with its OWN NavbarDProps (deliberately not SectionBaseProps) — no className API',
};

const components = Object.entries(Raditz).filter(([name, value]) => isComponentExport(name, value));

describe('API contract (component floor): className reaches the document from every barrel export', () => {
  it('found a meaningful component surface', () => {
    expect(components.length).toBeGreaterThan(50);
  });

  it('FLOOR tables stay in sync with the barrel (staleness guard)', () => {
    for (const name of [...Object.keys(FLOOR_PROPS), ...Object.keys(FLOOR_SKIP)]) {
      expect(name in Raditz, `${name} is no longer exported — update the floor tables`).toBe(true);
    }
  });

  for (const [name, value] of components) {
    if (name in FLOOR_SKIP) {
      it.skip(`${name} — skipped: ${FLOOR_SKIP[name]}`, () => {});
      continue;
    }
    it(name, () => {
      const C = value as React.ComponentType<Record<string, unknown>>;
      // Sections mount via their `children` body-override slot, so no section
      // needs per-variant content props here.
      const base = sectionExports.has(name) ? { children: 'x' } : {};
      render(<C className={SENTINEL} {...base} {...FLOOR_PROPS[name]} />);
      expect(document.getElementsByClassName(SENTINEL).length).toBeGreaterThan(0);
    });
  }
});
