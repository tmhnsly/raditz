# Adaptable Sections & Consumption Polish — Implementation Plan (Phase 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all 18 Raditz sections content-driven (required props for essential content, optional for the rest, `children` for full control), add dark-by-default support, and document utilities + literal-union types in the catalog — so the library is reusable across products while staying adaptable.

**Architecture:** Each section *type* gets one props interface shared by its variants, extending the existing `SectionVariantProps` + a `children` body-override. Shared helpers (`SectionAction`, `SectionBaseProps`, a `SectionActions` renderer) live in `src/lib/SectionShell.tsx` (already public). Hardcoded demo copy moves from each section component into its `*.stories.tsx`. The pattern is established on Hero first, then applied in batches.

**Tech Stack:** TypeScript (strict), React 18, Vitest + Testing Library, Storybook CSF3, `react-docgen-typescript` (catalog), pnpm.

## Global Constraints

- Package manager is **pnpm**. `"private": true`, `name: "raditz"`.
- **Required = irreducible content** (omitting is a TS error); **optional = embellishments** (omitting renders nothing, section still works). NO demo-copy defaults inside components.
- One props interface **per section type, shared by its variants**; variants render the same content their own way. Item types carry a superset of fields.
- `children`, when provided, **replaces the auto-rendered body** inside the section's themed shell (background/padding/width preserved).
- Actions render via `<Button>`; prefer `href` (Server-Component-safe). Don't add hooks to currently-static sections (keep their RSC status; only Pricing + Navbar are `'use client'`).
- **Demo copy moves into `*.stories.tsx`.** All section stories + the a11y gate (`src/a11y.test.tsx`, first story of each) + smoke tests stay green.
- After public-surface changes: `pnpm gen:barrel && pnpm gen:catalog`, and `pnpm release:preflight` must pass (drift gate). `pnpm build:pkg` + `node scripts/check-consumer.mjs` + `pnpm test` stay green.
- **Keep docs current** (standing user preference): regenerate the catalog and update `CONTEXT.md` as part of this work.
- Commit per task; clean tree after each.

## File Structure

**Modified — shared:**
- `src/lib/SectionShell.tsx` — add `SectionAction`, `SectionBaseProps`, `SectionActions` (exported; reach the barrel via the existing `./lib/SectionShell` allowlist entry).
- `src/lib/useColorScheme.ts` — `useColorScheme({ defaultScheme })`.
- `scripts/gen-catalog.mjs` — literal-union prop types + a "utilities" section.
- `templates/{next,vite}/...` — `DEFAULT_SCHEME` wiring.
- `CONTEXT.md` — content-driven sections + distribution-system entries.

**Modified — per section (component + story, sometimes test):**
- `src/sections/<Name>/<Name>.tsx` — parametrize content via props.
- `src/sections/<Name>/<Name>.stories.tsx` — supply the (relocated) demo content as args.
- `src/sections/<Name>/<Name>.test.tsx` — keep smoke test; add a focused content/`children` test where useful.

---

## Task 1: Catalog — literal union prop types

**Files:**
- Modify: `scripts/gen-catalog.mjs`, `catalog/llms.txt` (regenerated)

**Interfaces:**
- Consumes: existing `gen-catalog.mjs` (`react-docgen-typescript` `parser`).
- Produces: prop types showing literal members (`'solid' | 'glass' | 'flat'`) not `enum`.

- [ ] **Step 1: Reproduce the issue**

```bash
cd /Users/tom/dev/raditz
pnpm gen:catalog >/dev/null 2>&1
awk '/^### Card$/,/^Usage:$/' catalog/llms.txt | grep -i "variant"
```
Expected (current/bad): `- variant?: enum (default: solid) …`

- [ ] **Step 2: Fix `fmtProp` to expand union/enum types**

In `scripts/gen-catalog.mjs`, replace the `type` derivation in `fmtProp` so it prefers the enum member values when react-docgen marks the type as `enum`. `react-docgen-typescript` puts the literal members in `prop.type.value` (an array of `{ value: "'solid'" }`). Update `fmtProp`:

```js
function fmtProp(p) {
  const opt = p.required ? '' : '?';
  let type = (p.type && p.type.name) || 'unknown';
  // Expand enums/unions to their literal members: enum -> 'a' | 'b' | 'c'
  if (type === 'enum' && p.type && Array.isArray(p.type.value)) {
    const members = p.type.value.map((m) => m.value).filter(Boolean);
    // Drop the noisy `undefined` member optionals carry; keep it readable.
    const cleaned = members.filter((m) => m !== 'undefined');
    if (cleaned.length && cleaned.length <= 12) type = cleaned.join(' | ');
  }
  const dv = p.defaultValue && p.defaultValue.value;
  const def = dv !== undefined && dv !== null && dv !== '' ? ` (default: ${dv})` : '';
  const desc = p.description ? ` — ${p.description.replace(/\s+/g, ' ').trim()}` : '';
  return `  - ${p.name}${opt}: ${type}${def}${desc}`;
}
```

- [ ] **Step 3: Regenerate and verify**

```bash
pnpm gen:catalog
awk '/^### Card$/,/^Usage:$/' catalog/llms.txt | grep -i "variant"
```
Expected: `- variant?: 'solid' | 'glass' | 'flat' (default: solid) — Surface style.`
Also spot-check Button: `grep -A2 "### Button" catalog/llms.txt | grep variant` → shows the 6 variant literals.

- [ ] **Step 4: Commit**

```bash
git add scripts/gen-catalog.mjs catalog/llms.txt
git commit -m "feat(catalog): expand enum prop types to literal unions"
```

---

## Task 2: Catalog — document utility/typography classes

**Files:**
- Modify: `scripts/gen-catalog.mjs`, `catalog/llms.txt` (regenerated)

**Interfaces:**
- Consumes: `gen-catalog.mjs`.
- Produces: a `## utilities` section in `catalog/llms.txt` listing public CSS classes.

- [ ] **Step 1: Add a utilities block to the generator**

In `scripts/gen-catalog.mjs`, after the `header` array and before writing, add a curated utilities section (hand-maintained — these are stable public classes from `styles.css`). Insert into the output between the header and the category sections:

```js
const UTILITIES = [
  ['.h-display', 'Largest display heading (hero titles).'],
  ['.h-section', 'Section heading.'],
  ['.lede', 'Lead paragraph under a heading.'],
  ['.eyebrow / .eyebrow2', 'Small label above a heading.'],
  ['.muted', 'De-emphasized text colour.'],
  ['.row / .col', 'Flex row / column with token gaps.'],
  ['.container', 'Max-width centered content wrapper.'],
];
const utilitiesBlock = [
  '## utilities (CSS classes)',
  '',
  'For BESPOKE layout only — prefer components/sections first. These public classes',
  'come from `raditz/styles.css` (already imported); use them in a section\'s `children`',
  'or your own markup:',
  '',
  ...UTILITIES.map(([cls, desc]) => `- \`${cls}\` — ${desc}`),
  '',
];
```
Then include `utilitiesBlock` in the final write, e.g. `header.concat(utilitiesBlock).concat(sections)`.

- [ ] **Step 2: Regenerate and verify**

```bash
pnpm gen:catalog
grep -q "^## utilities" catalog/llms.txt && echo "utilities section present"
grep -q "h-display" catalog/llms.txt && echo "lists h-display"
```
Expected: both confirmations print.

- [ ] **Step 3: Commit**

```bash
git add scripts/gen-catalog.mjs catalog/llms.txt
git commit -m "feat(catalog): document public utility/typography classes"
```

---

## Task 3: Dark-by-default (`useColorScheme({ defaultScheme })` + templates)

**Files:**
- Modify: `src/lib/useColorScheme.ts`
- Create: `src/lib/useColorScheme.test.tsx`
- Modify: `templates/next/app/layout.tsx`, `templates/next/app/theme-runtime.tsx`, `templates/vite/src/ThemeRuntime.tsx`, both templates' `CLAUDE.md`

**Interfaces:**
- Consumes: existing `useColorScheme`.
- Produces: `useColorScheme(opts?: { defaultScheme?: 'system' | 'light' | 'dark' })` (default `'system'`). Templates expose a `DEFAULT_SCHEME` constant.

- [ ] **Step 1: Write the failing test**

Create `src/lib/useColorScheme.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useColorScheme } from './useColorScheme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('useColorScheme defaultScheme', () => {
  it('follows system (light in jsdom) by default', () => {
    const { result } = renderHook(() => useColorScheme());
    expect(result.current.scheme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('honours defaultScheme: dark when nothing is persisted', () => {
    const { result } = renderHook(() => useColorScheme({ defaultScheme: 'dark' }));
    expect(result.current.scheme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persisted choice wins over defaultScheme', () => {
    localStorage.setItem('rdz-color-scheme', 'light');
    const { result } = renderHook(() => useColorScheme({ defaultScheme: 'dark' }));
    expect(result.current.scheme).toBe('light');
  });
});
```

- [ ] **Step 2: Run it — expect failure**

```bash
pnpm exec vitest run src/lib/useColorScheme.test.tsx
```
Expected: FAIL — the `defaultScheme: 'dark'` test gets `light` (current hook ignores args).

- [ ] **Step 3: Implement `defaultScheme`**

In `src/lib/useColorScheme.ts`, thread an option through `loadPreference` + the hook. Replace the `loadPreference` function and the `useColorScheme` signature:

```ts
function loadPreference(defaultScheme: ColorPreference = 'system'): ColorPreference {
  if (typeof localStorage !== 'undefined') {
    try {
      const v = localStorage.getItem(KEY);
      if (v === 'light' || v === 'dark') return v;
    } catch { /* ignore */ }
  }
  return defaultScheme;
}

export function useColorScheme(opts?: { defaultScheme?: ColorPreference }) {
  const fallback = opts?.defaultScheme ?? 'system';
  const [preference, setPreference] = useState<ColorPreference>(() => loadPreference(fallback));
  // ...rest unchanged (system state, effects, toggle, return)...
}
```
Keep everything else (the `system` state, the two effects, `toggle`, `setPreference`, the return object) unchanged. Note `ColorPreference = 'system' | 'light' | 'dark'`, so `{ defaultScheme }` accepts all three.

- [ ] **Step 4: Run the test — expect pass**

```bash
pnpm exec vitest run src/lib/useColorScheme.test.tsx   # expect 3 passed
```

- [ ] **Step 5: Wire templates to a `DEFAULT_SCHEME` constant**

In `templates/vite/src/ThemeRuntime.tsx`:

```tsx
import { useColorScheme } from 'raditz';

// Set your brand's default colour scheme: 'system' (follow OS), 'dark', or 'light'.
const DEFAULT_SCHEME = 'system' as const;

export function ThemeRuntime() {
  useColorScheme({ defaultScheme: DEFAULT_SCHEME });
  return null;
}
```

In `templates/next/app/theme-runtime.tsx`:

```tsx
'use client';
import { useColorScheme } from 'raditz';

// Set your brand's default colour scheme: 'system' (follow OS), 'dark', or 'light'.
export const DEFAULT_SCHEME = 'system' as const;

export function ThemeRuntime() {
  useColorScheme({ defaultScheme: DEFAULT_SCHEME });
  return null;
}
```

In `templates/next/app/layout.tsx`, make the no-flash script honour the same default (read it from a literal so it inlines):

```tsx
import { DEFAULT_SCHEME } from './theme-runtime';
// ...
const noFlash = `(function(){try{var k='rdz-color-scheme',d='${DEFAULT_SCHEME}',v=localStorage.getItem(k);` +
  `var dark=v==='dark'||(v!=='light'&&(d==='dark'||(d!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)));` +
  `if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`;
```
(So `DEFAULT_SCHEME='dark'` → dark before paint; `'light'` → never; `'system'` → OS. Default stays `'system'`.)

- [ ] **Step 6: Document in both templates' CLAUDE.md**

Add to the "Brand / theming" section of `templates/vite/CLAUDE.md` and `templates/next/CLAUDE.md`:

```markdown
- Default colour scheme: set `DEFAULT_SCHEME` in the theme runtime (`'system'` follows
  the OS — the default; `'dark'` or `'light'` opens the site in that scheme, still
  user-toggleable). The Next no-flash script reads it so there's no flash.
```

- [ ] **Step 7: Verify + commit**

```bash
pnpm exec tsc -b && pnpm test 2>&1 | tail -3   # full suite green (now +3)
git add src/lib/useColorScheme.ts src/lib/useColorScheme.test.tsx templates/
git commit -m "feat: useColorScheme({defaultScheme}) + template DEFAULT_SCHEME (dark-by-default opt-in)"
```

---

## Task 4: Section content foundation + Hero (the pattern)

**Files:**
- Modify: `src/lib/SectionShell.tsx` (shared types + `SectionActions`)
- Modify: `src/sections/Hero/Hero.tsx`, `src/sections/Hero/Hero.stories.tsx`
- Modify/keep: `src/sections/Hero/Hero.test.tsx`

**Interfaces:**
- Consumes: `SectionShell`, `Button` (`ButtonProps`), `IconName`.
- Produces (used by ALL later section tasks):
  - `type SectionAction = { label: string; href?: string; onClick?: () => void; variant?: ButtonProps['variant']; size?: ButtonProps['size']; icon?: IconName | ReactNode }`
  - `type SectionBaseProps = SectionVariantProps & { children?: ReactNode }`
  - `function SectionActions(props: { actions?: SectionAction[]; size?: ButtonProps['size']; className?: string }): ReactElement | null`
  - `interface HeroProps extends SectionBaseProps { title: ReactNode; eyebrow?: ReactNode; lede?: ReactNode; actions?: SectionAction[]; media?: ReactNode }`

- [ ] **Step 1: Add shared section types + `SectionActions` to `SectionShell.tsx`**

Append to `src/lib/SectionShell.tsx` (it already exports `SectionVariantProps`):

```tsx
import type { ReactElement, ReactNode } from 'react';
import { Button, type ButtonProps } from '../components/controls/Button';
import type { IconName } from '../components/foundation/Icon/Icon';

/** A call-to-action rendered by a section as a <Button>. Prefer `href`
 * (Server-Component-safe); `onClick` requires a client boundary. */
export type SectionAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  icon?: IconName | ReactNode;
};

/** Base props every section variant accepts: the decorative backdrop options
 * plus a `children` escape hatch that replaces the auto-rendered body. */
export type SectionBaseProps = SectionVariantProps & { children?: ReactNode };

/** Renders a row of CTAs from `actions`. Returns null when empty. */
export function SectionActions({
  actions,
  size,
  className = 'row sx-row-center',
}: {
  actions?: SectionAction[];
  size?: ButtonProps['size'];
  className?: string;
}): ReactElement | null {
  if (!actions || actions.length === 0) return null;
  return (
    <div className={className}>
      {actions.map((a, i) => (
        <Button key={i} href={a.href} onClick={a.onClick} variant={a.variant} size={a.size ?? size} icon={a.icon}>
          {a.label}
        </Button>
      ))}
    </div>
  );
}
```
(Confirm the Button import path/`ButtonProps` export and `IconName` path match the repo — adjust if Button re-exports differ. Button currently lives at `src/components/controls/Button/Button.tsx` and exports `ButtonProps`.)

- [ ] **Step 2: Write the failing Hero content test**

Replace `src/sections/Hero/Hero.test.tsx` with a content-aware test (keep a story smoke check too):

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './Hero.stories';
import { HeroA } from './Hero';

const composed = composeStories(stories);

describe('Hero', () => {
  for (const [name, Story] of Object.entries(composed)) {
    it(`renders the ${name} story`, () => {
      const { container } = render(<Story />);
      expect(container).toBeTruthy();
    });
  }

  it('renders the required title and optional content', () => {
    render(<HeroA title="Frequency DJ Studio" eyebrow="Booking 2026" lede="Pro decks." actions={[{ label: 'Book', href: '/book' }]} />);
    expect(screen.getByText('Frequency DJ Studio')).toBeInTheDocument();
    expect(screen.getByText('Booking 2026')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Book' })).toHaveAttribute('href', '/book');
  });

  it('children override the body', () => {
    render(<HeroA title="ignored"><div data-testid="custom">Custom</div></HeroA>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(screen.queryByText('ignored')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run it — expect failure**

```bash
pnpm exec vitest run src/sections/Hero/Hero.test.tsx
```
Expected: FAIL — `HeroA` doesn't accept `title`/`children` yet (TS + assertion failures).

- [ ] **Step 4: Parametrize Hero**

Rewrite `src/sections/Hero/Hero.tsx`. Each variant takes `HeroProps`, renders `children` if present else the content props. Keep each variant's existing layout/classes; replace hardcoded copy with props. Example for `HeroA` (apply the same shape to `HeroB`/`HeroC`, preserving their distinct layouts + `media` usage):

```tsx
import type { ReactNode } from 'react';
import { SectionShell, SectionActions, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';

export interface HeroProps extends SectionBaseProps {
  /** Headline (required). */
  title: ReactNode;
  /** Small label/badge above the title. */
  eyebrow?: ReactNode;
  /** Lead paragraph under the title. */
  lede?: ReactNode;
  /** CTAs. */
  actions?: SectionAction[];
  /** Media slot (used by split/full-bleed variants). */
  media?: ReactNode;
}

export function HeroA({ title, eyebrow, lede, actions, media, background = 'none', children, ...props }: HeroProps) {
  return (
    <SectionShell wrap="col sx-center sx-gap-5" background={background} {...props}>
      {children ?? (
        <>
          {eyebrow && <span className="rdz-badge rdz-badge--soft">{eyebrow}</span>}
          <h2 className="h-display sx-hero__title">{title}</h2>
          {lede && <p className="lede sx-hero__lede">{lede}</p>}
          <SectionActions actions={actions} size="lg" />
        </>
      )}
    </SectionShell>
  );
}
// HeroB: same props; keep its split layout; render `media` in the media slot (placeholder removed). 
// HeroC: same props; keep its full-bleed layout.
```
For `HeroB`/`HeroC`, where the old code had a `<div className="ph …">product shot</div>` placeholder, render `{media}` there (only when provided; otherwise omit the media slot). Replace each hardcoded heading/lede/eyebrow/buttons with the corresponding prop using the same `children ?? (...)` wrapper.

- [ ] **Step 5: Move demo copy into the story**

Rewrite `src/sections/Hero/Hero.stories.tsx` so each story passes the (relocated) demo content as args/props:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { HeroA, HeroB, HeroC } from './Hero';

const meta: Meta = { title: 'Sections/Hero' };
export default meta;
type Story = StoryObj;

const demo = {
  eyebrow: 'New · v2 components',
  title: 'The design foundation that re-skins in one line',
  lede: 'Radix Colors and a token system wired into 53 components. Change one accent and the whole product follows.',
  actions: [
    { label: 'Get started', href: '#' },
    { label: 'Read the docs', href: '#', variant: 'outline' as const },
  ],
};

export const A_CenteredDualCTA: Story = { name: 'A · Centered, dual CTA', render: () => <HeroA {...demo} /> };
export const B_SplitCopyMedia: Story = { name: 'B · Split — copy + media', render: () => <HeroB {...demo} media={<div className="ph sx-hero__media">product shot</div>} /> };
export const C_AccentFullBleed: Story = { name: 'C · Accent full-bleed', render: () => <HeroC {...demo} /> };
```

- [ ] **Step 6: Run Hero tests + typecheck**

```bash
pnpm exec vitest run src/sections/Hero/Hero.test.tsx   # expect all pass
pnpm exec tsc -b                                         # types clean
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/SectionShell.tsx src/sections/Hero
git commit -m "feat(sections): content-driven Hero + shared SectionAction/SectionActions/SectionBaseProps"
```

---

## Tasks 5–11: Apply the Hero pattern to the remaining sections

Each task below follows the **exact pattern from Task 4**: define `<Name>Props extends SectionBaseProps`, make essential content required + embellishments optional, render `children ?? (...)`, use `SectionActions` for CTAs, map item arrays into each variant's existing layout, and move the current hardcoded copy into the story as demo data. Each task: update component + story + test, run `pnpm exec vitest run src/sections/<Name>/`, `pnpm exec tsc -b`, commit `feat(sections): content-driven <Name>`.

For every task, the **content inventory** lists what the section hardcodes today → the prop it becomes (R = required, o = optional). The implementer reads the current `<Name>.tsx` to get the exact demo strings to relocate into the story.

### Task 5: Scalar sections — Cta, Announcement, Marquee, Newsletter, NotFound

**Files:** `src/sections/{Cta,Announcement,Marquee,Newsletter,NotFound}/*.{tsx,stories.tsx,test.tsx}`

**Interfaces — Produces:**
- `CtaProps extends SectionBaseProps { title: ReactNode /*R*/; sub?: ReactNode; actions?: SectionAction[]; emailCapture?: { placeholder?: string; action: SectionAction } }`
- `AnnouncementProps extends SectionBaseProps { text: ReactNode /*R*/; action?: SectionAction; dismissible?: boolean }`
- `MarqueeProps extends SectionBaseProps { items: ReactNode[] /*R*/ }`
- `NewsletterProps extends SectionBaseProps { action: SectionAction /*R*/; title?: ReactNode; sub?: ReactNode; placeholder?: string }`
- `NotFoundProps extends SectionBaseProps { title?: ReactNode; message?: ReactNode; actions?: SectionAction[] }` (NotFound has no required field — `title` defaults to the string "Page not found" via `title ?? 'Page not found'`, an allowed literal fallback, not relocated demo copy.)

Content inventory:
- **Cta** (CtaA: title + 2 buttons; CtaB: title-ink + sub + email input + button): `title`→R; the two buttons→`actions`(o); CtaB's "No credit card required."→`sub`(o); CtaB's email input + "Request access" button→`emailCapture`(o, `{ placeholder:'you@studio.com', action:{label:'Request access'} }`).
- **Announcement** (A/B short banners): the banner text→`text`(R); any link/button→`action`(o); a close affordance→`dismissible`(o; when true render a dismiss button — keep it `'use client'`-free by using a CSS-only `<details>`/checkbox OR omit interactivity and just render the × with an `onClick` only if provided — simplest: render a static banner; `dismissible` toggles a `[hidden]`-via-`<details>` wrapper. If interactivity is needed, mark the file `'use client'` and run `pnpm codemod:use-client`.) Keep minimal.
- **Marquee**: the scrolling chips/logos→`items`(R, `ReactNode[]`); render them in the existing marquee track.
- **Newsletter**: heading→`title`(o); subtext→`sub`(o); the input→`placeholder`(o); the submit button→`action`(R).
- **NotFound**: the "404"/heading→`title`(o, fallback "Page not found"); body→`message`(o); home/back buttons→`actions`(o).

Stories: move each section's current copy into `render: () => <XxxA {...demo} />`.

### Task 6: Card-grid sections — Features, Stats

**Files:** `src/sections/{Features,Stats}/*.{tsx,stories.tsx,test.tsx}`

**Interfaces — Produces:**
- `FeaturesItem { title: ReactNode; description?: ReactNode; icon?: ReactNode; media?: ReactNode }`
- `FeaturesProps extends SectionBaseProps { items: FeaturesItem[] /*R*/; eyebrow?: ReactNode; heading?: ReactNode }`
- `StatItem { value: ReactNode; label: ReactNode }`
- `StatsProps extends SectionBaseProps { stats: StatItem[] /*R*/; heading?: ReactNode }`

Content inventory:
- **Features** A (eyebrow "Why Raditz" + heading "Everything wired together" + 3 cards{icon,title,desc}); B (bento: lead card + cells); C (split spotlights with media). All three consume `items` + optional `eyebrow`/`heading`. Map: A → grid of all items (icon/title/description); B → first item as the bento lead, rest as cells; C → items as alternating spotlights (use `item.media` for the media side, fall back to the `ph` placeholder only inside the STORY's demo data, not the component). Keep each variant's wrapper classes.
- **Stats** A (4 cells) / B (3 band cells): consume `stats` (value/label) + optional `heading`. Render cells in each variant's grid.

Stories: relocate the demo items (e.g. Features A's three `{icon, title:'12-step color', description:'…'}`; Stats A's `{value:'53', label:'components'}` ×4) into the stories. For Features icons, pass the existing inline `<svg className="ico">…</svg>` as `icon` in the story demo.

### Task 7: Pricing

**Files:** `src/sections/Pricing/*.{tsx,stories.tsx,test.tsx}`

**Interfaces — Produces:**
- `PricingTier { name: ReactNode; price: ReactNode; priceYearly?: ReactNode; period?: ReactNode; blurb?: ReactNode; features?: ReactNode[]; action?: SectionAction; popular?: boolean }`
- `PricingProps extends SectionBaseProps { tiers: PricingTier[] /*R*/; heading?: ReactNode; sub?: ReactNode }`

Content inventory: PricingA (heading "Simple, scalable pricing" + sub + 3 tiers{name, blurb, price, period:'/mo', button, features[], popular}) → `tiers` + optional `heading`/`sub`. PricingB (monthly/yearly `Tabs` + 2 tiers) keeps its `'use client'` + `useState`; show the toggle when any tier has `priceYearly`, and switch each tier's displayed price between `price` (mo) and `priceYearly` (yr). Render tier `action` via `<Button>` (keep the existing button classes by passing `variant`). Map `features` into the `<ul>`. `popular` renders the "Popular" badge + `sx-price__card-pop`.

Story: relocate the 3 demo tiers (Starter $0, Team $24 popular, Enterprise Custom) into PricingA's story; PricingB's Pro/Business with `price`+`priceYearly`.

### Task 8: Quote/Q&A sections — Faq, Testimonials, TestimonialCarousel

**Files:** `src/sections/{Faq,Testimonials,TestimonialCarousel}/*.{tsx,stories.tsx,test.tsx}`

**Interfaces — Produces:**
- `FaqProps extends SectionBaseProps { items: { question: ReactNode; answer: ReactNode }[] /*R*/; heading?: ReactNode }`
- `Testimonial { quote: ReactNode; name?: ReactNode; role?: ReactNode; avatar?: ReactNode }`
- `TestimonialsProps extends SectionBaseProps { quotes: Testimonial[] /*R*/; heading?: ReactNode }`
- `TestimonialCarouselProps extends SectionBaseProps { quotes: Testimonial[] /*R*/; heading?: ReactNode }`

Content inventory:
- **Faq** A uses the `Accordion` component — map `items` `{question,answer}` → Accordion `items` `{ value:String(i), title:question, content:answer }`. B is a plain grid → render `items` as the `<strong>/<span>` pairs. Move `FAQ_ITEMS` + FaqB's hardcoded pairs into the stories.
- **Testimonials** A/B: map `quotes` into the existing card markup (quote, avatar initials, name, role). Avatar: accept `avatar` ReactNode (story passes the `<span className="rdz-avatar">MO</span>`).
- **TestimonialCarousel**: same `quotes` shape; keep its carousel mechanics.

### Task 9: Team, Blog, SocialProof, Comparison

**Files:** `src/sections/{Team,Blog,SocialProof,Comparison}/*.{tsx,stories.tsx,test.tsx}`

**Interfaces — Produces:**
- `TeamProps extends SectionBaseProps { members: { name: ReactNode; role?: ReactNode; avatar?: ReactNode; bio?: ReactNode }[] /*R*/; heading?: ReactNode }`
- `BlogProps extends SectionBaseProps { posts: { title: ReactNode; href?: string; excerpt?: ReactNode; image?: ReactNode; date?: ReactNode; tag?: ReactNode }[] /*R*/; heading?: ReactNode }`
- `SocialProofProps extends SectionBaseProps { logos: { name: ReactNode; src?: string; node?: ReactNode }[] /*R*/; label?: ReactNode }`
- `ComparisonProps extends SectionBaseProps { columns: { name: ReactNode; highlight?: boolean }[] /*R*/; rows: { feature: ReactNode; values: (boolean | ReactNode)[] }[] /*R*/; heading?: ReactNode }`

Content inventory: read each section's current markup and relocate its demo data into the story. Comparison: the table header cells → `columns`; each feature row → `rows` (a `boolean` value renders the check/cross glyph the section already uses; a node renders as-is). SocialProof: the logo row → `logos`; any "Trusted by" label → `label`(o).

### Task 10: Navbar (A/B/C shared + D tab bar)

**Files:** `src/sections/Navbar/*.{tsx,stories.tsx,test.tsx}`

**Interfaces — Produces:**
- `NavbarProps extends SectionBaseProps { brand: { name: ReactNode; logo?: ReactNode; href?: string } /*R*/; links?: { label: ReactNode; href: string }[]; actions?: SectionAction[] }` (NavbarA/B/C)
- `NavbarDProps { tabs: { id: string; label: ReactNode; icon?: ReactNode }[] /*R*/; activeId?: string; onTabChange?: (id: string) => void }` (own type; the file stays `'use client'`)

Content inventory: NavbarA/B/C keep their burger + `NavSheet` overlay mechanics (stay `'use client'`); replace the hardcoded brand "S"/"Raditz", the `<nav>` links, and the Sign in / Get started buttons with `brand`/`links`/`actions`. Render `links` in both the bar `<nav>` and the `NavSheet`. NavbarD: replace the hardcoded 5 tabs + `TAB_ICONS` with `tabs` (icon as ReactNode); keep `useState` for active unless `activeId`/`onTabChange` provided (controlled/uncontrolled). Stories relocate the demo brand/links/tabs.

### Task 11: Footer (A columns + B bar)

**Files:** `src/sections/Footer/*.{tsx,stories.tsx,test.tsx}`

**Interfaces — Produces:**
- `FooterProps extends SectionBaseProps { columns?: { heading: ReactNode; links: { label: ReactNode; href?: string }[] }[]; brand?: { name: ReactNode; logo?: ReactNode; blurb?: ReactNode }; copyright?: ReactNode }` (shared; FooterA uses `brand`+`columns` — `columns` required-for-A enforced by the story/usage; FooterB uses `copyright`+`columns`/links.)

Content inventory: FooterA (brand block + 3 link columns Product/Resources/Company) → `brand` + `columns`. FooterB (copyright bar + Privacy/Terms/Status) → `copyright` + a single `columns`/links row. Relocate demo data into stories. (Footer's required-ness is softer; keep all fields optional but ensure each variant renders sensibly when its expected field is present; the story supplies them.)

---

## Task 12: Regenerate catalog, update CONTEXT.md, re-verify consumer

**Files:**
- Regenerate: `src/index.ts`, `catalog/llms.txt`
- Modify: `CONTEXT.md`

**Interfaces:**
- Consumes: all prior tasks.
- Produces: current docs + a green consumer retest.

- [ ] **Step 1: Regenerate the public surface + catalog**

```bash
pnpm gen:barrel && pnpm gen:catalog
pnpm release:preflight   # expect OK (commit regenerated artifacts if it reports drift)
grep -q "### HeroA" catalog/llms.txt && grep -A12 "### HeroA" catalog/llms.txt | grep -q "title" && echo "Hero props now in catalog"
```
Expected: sections now document their content props (e.g. HeroA shows `title`, `actions`, …).

- [ ] **Step 2: Update CONTEXT.md**

Add two concise sections to `CONTEXT.md`:
- **"Sections are content-driven"**: one props interface per section type (shared by variants), `SectionBaseProps` + `SectionAction`, required-essential/optional-rest/`children`-override; demo copy lives in stories.
- **"Distribution system"**: the library ships as a built package (`dist/` ESM + `raditz/styles.css`), a generated `catalog/llms.txt`, Vite/Next templates, the `/release` skill, and global `/raditz-new` + `/raditz-promote`; products brand via `theme.css` or `useTheme({accent})` and set `DEFAULT_SCHEME`.
Keep it tight; link to `docs/superpowers/specs` + `plans`.

- [ ] **Step 3: Full gate**

```bash
pnpm test 2>&1 | tail -3       # all sections' stories + a11y + new content/children tests green
pnpm build:pkg && node scripts/check-consumer.mjs
```

- [ ] **Step 4: Re-run the DJ-studio consumer with REAL section content**

```bash
pnpm build:pkg
rm -rf /tmp/frequency-dj && cp -r templates/next /tmp/frequency-dj && cd /tmp/frequency-dj
RADITZ_PATH=/Users/tom/dev/raditz node scripts/rdz-link.mjs link >/dev/null 2>&1
```
Write `/tmp/frequency-dj/app/page.tsx` using real DJ content via the new props (e.g. `<HeroA title="Frequency DJ Studio" eyebrow="Booking 2026" lede="…" actions={[{label:'Book',href:'/book'}]} />`, `<PricingA tiers={[…]} />`, `<FooterA brand={…} columns={[…]} />`), set `DEFAULT_SCHEME='dark'` in `app/theme-runtime.tsx`, then:

```bash
pnpm build && echo "DJ site builds with real section content"
grep -rl "Frequency DJ Studio" .next/server/app/ >/dev/null && echo "real hero copy rendered (no placeholder)"
grep -rL "design foundation that re-skins" .next/server/app/index.html >/dev/null && echo "library demo copy ABSENT"
cd /Users/tom/dev/raditz && rm -rf /tmp/frequency-dj
```
Expected: builds; real DJ copy present; the library's placeholder hero copy absent.

- [ ] **Step 5: Commit**

```bash
git add src/index.ts catalog/llms.txt CONTEXT.md
git commit -m "docs: regenerate catalog with section props + update CONTEXT.md (content-driven sections + distribution)"
```

---

## Self-Review (against the spec)

**Spec coverage:** content model + per-section props (Tasks 4–11, matching the spec's table); demo-copy→stories (every section task); dark-by-default (Task 3); catalog utilities (Task 2) + literal unions (Task 1); CONTEXT.md + catalog regen (Task 12); DJ consumer retest (Task 12). ✔

**Placeholder scan:** Task 4 (Hero) carries full code as the canonical pattern; Tasks 5–11 give complete props interfaces + an exact content inventory (what each section hardcodes → which prop) + story-relocation instruction — concrete transforms, not vague directives. The repetitive per-variant JSX is specified by the inventory + the Hero template rather than re-pasted 40×. ✔

**Type consistency:** `SectionAction`, `SectionBaseProps`, `SectionActions` (Task 4) are reused verbatim by Tasks 5–11; item-type names (`FeaturesItem`, `PricingTier`, `StatItem`, `Testimonial`) are defined once and referenced where used. `useColorScheme({defaultScheme})` (Task 3) matches the template wiring. ✔

**Risk note:** Making content required flips section stories from `<XxxA />` to `<XxxA {...demo} />` — the a11y test reads the first story, so every section's story MUST be updated in the same task (built into each task). Sections that gain interactivity (e.g. a dismissible Announcement) must run `pnpm codemod:use-client` + be re-checked.

## Follow-on
None — this completes the adaptable-sections work. After merge, optionally run `/release` to cut the first tag so `raditz-new` pins a version.
