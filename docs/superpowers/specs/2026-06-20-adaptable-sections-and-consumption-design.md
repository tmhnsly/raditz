# Adaptable Sections & Consumption Polish — Design

**Date:** 2026-06-20
**Status:** Approved design, pending implementation plan (Phase 4 of the distribution effort)

## Problem

A real end-to-end test (scaffolding a Next.js "DJ studio" product from `templates/next`) confirmed the distribution system works — scaffold → link → build → render → theme, RSC-clean — but surfaced four gaps that make the library awkward for actual projects:

1. **Sections render fixed placeholder copy.** Section variants (`HeroA`, `FeaturesA`, `PricingA`, …) accept only `SectionVariantProps` (`background`/`parallax`/`image`/`video`) — no content. Used as-is, a product's hero/features/pricing show the library's demo copy ("The design foundation that re-skins in one line"). Today the only way to use a section with real content is to copy its markup. **This is the main gap.**
2. **No dark-by-default.** `useColorScheme()` always starts from the OS preference; there is no project-level default. A brand that wants to open dark (clubs, creative studios) can't, cleanly.
3. **Custom-section utility classes are undocumented.** Building bespoke layout needs `.h-display`, `.lede`, `.eyebrow`, `.row`, `.col`, `.container`, `.muted` (they exist in `styles.css` and work) but they aren't in `catalog/llms.txt`, so a consuming agent doesn't know they exist.
4. **Catalog shows `variant?: enum`** for some props instead of the literal union (`'solid' | 'glass' | 'flat'`).

## Goals

- Sections become **content-driven and adaptable**: pass your own copy/items/CTAs via props, or your own body via `children`, while keeping the section's themed shell.
- Essential content is **required** (a section can't be shipped empty or with placeholder copy); genuinely-optional content is **optional** and simply doesn't render when omitted.
- Backward-compatible *showroom*: the Storybook stories keep rich sample content; all stories + a11y tests stay green.
- A product can default its colour scheme (still defaulting to the user's system preference unless it opts in).
- The catalog documents the public utility/typography classes and shows literal union types.
- **Docs stay current**: `catalog/llms.txt` regenerates and `CONTEXT.md` is updated to describe the section content model + the distribution system. (Standing preference: keep context/markdown docs up to date as code changes.)

## Section content model

Each section **type** gets ONE props interface, shared by all its variants (`HeroA`/`HeroB`/`HeroC` all take `HeroProps`). Every section props type extends a common base:

```ts
// helper types (exported from the barrel)
type SectionAction = {
  label: string;
  href?: string;            // prefer href — works in Server Components
  onClick?: () => void;     // requires the section be used in a client component
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  icon?: IconName | ReactNode;
};

// existing SectionVariantProps = { background?, parallax?, image?, video? }
type SectionBaseProps = SectionVariantProps & {
  /** Full-body override: your content inside the section's themed shell. */
  children?: ReactNode;
};
```

Three levels of use, by design:

```tsx
<HeroA title="Frequency DJ Studio" />                       // 1. minimal — just the required field
<HeroA title="Frequency DJ Studio" eyebrow="Booking 2026"   // 2. structured content, this variant's layout
       lede="Pro decks, treated rooms, engineers who mix."
       actions={[{ label: 'Book', href: '/book' },
                 { label: 'Rooms', href: '/rooms', variant: 'outline' }]} />
<HeroA>{/* bespoke JSX */}</HeroA>                            // 3. full control inside Hero's shell + background
```

Rules:
- **Required = the irreducible content** that defines the section; omitting it is a TypeScript error. **Optional = embellishments**; omitting renders nothing for them and the section still works.
- **Variants share the props type**; each lays the same content out its own way. Item types carry a **superset** of fields so any variant can render (a field a given variant doesn't use is ignored).
- **`children` overrides the auto-rendered body** (content props are ignored for the body when `children` is present), keeping the section's shell, background, padding, width, and theming.
- **Content props insulate the product from internal `sx-*` classes** — the section still emits its own wrapper markup; the product only needs public utility classes for the `children`/from-scratch path.
- **Actions render via `<Button>`.** Prefer `href` (Server-Component-safe); `onClick` requires a client boundary (an RSC reality, documented).
- **RSC status is unchanged**: static sections stay server components; only sections that already use hooks (Pricing, Navbar) keep `"use client"`. Passing content props doesn't add hooks.

### Per-section props (beyond `SectionBaseProps`)

Item-array fields are **required**; scalar headings/embellishments are **optional**.

| Section (variants) | Required | Optional |
|---|---|---|
| Hero (A,B,C) | `title` | `eyebrow`, `lede`, `actions: SectionAction[]`, `media: ReactNode` |
| Features (A,B,C) | `items: FeaturesItem[]` `{ title; description?; icon?: ReactNode; media?: ReactNode }` | `eyebrow`, `heading` |
| Pricing (A,B) | `tiers: PricingTier[]` `{ name; price; priceYearly?; period?; blurb?; features?: string[]; action?: SectionAction; popular? }` | `heading`, `sub` (B shows a monthly/yearly toggle when any tier has `priceYearly`) |
| Stats (A,B) | `stats: { value; label }[]` | `heading` |
| Cta (A,B) | `title` | `sub`, `actions: SectionAction[]`, `emailCapture?: { placeholder?; action: SectionAction }` (B) |
| Faq (A,B) | `items: { question; answer: ReactNode }[]` | `heading` |
| Testimonials (A,B) | `quotes: Testimonial[]` `{ quote; name?; role?; avatar?: ReactNode }` | `heading` |
| TestimonialCarousel (A) | `quotes: Testimonial[]` | `heading` |
| Team (A) | `members: { name; role?; avatar?: ReactNode; bio? }[]` | `heading` |
| Blog (A,B) | `posts: { title; href?; excerpt?; image?; date?; tag? }[]` | `heading` |
| SocialProof (A,B) | `logos: { name; src?; node?: ReactNode }[]` | `label` |
| Comparison (A) | `columns: { name; highlight? }[]`, `rows: { feature; values: (boolean \| string)[] }[]` | `heading` |
| Marquee (A) | `items: ReactNode[]` | — |
| Announcement (A,B) | `text: ReactNode` | `action?: SectionAction`, `dismissible?` |
| Newsletter (A) | `action: SectionAction` *(or `onSubmit`)* | `title`, `sub`, `placeholder` |
| NotFound (A) | — | `title` (default "Page not found"), `message`, `actions: SectionAction[]` |
| Navbar (A,B,C) | `brand: { name; logo?: ReactNode; href? }` | `links: { label; href }[]`, `actions: SectionAction[]` |
| Navbar (D — app tab bar) | `tabs: { id; label; icon?: ReactNode }[]` | `activeId`, `onTabChange` |
| Footer (A) | `columns: { heading; links: { label; href }[] }[]` | `brand?: { name; logo?; blurb? }` |
| Footer (B — bar) | — | `copyright`, `links: { label; href }[]`, `brand?` |

`NavbarD` is a structurally distinct component (a bottom tab bar), so it keeps its own props rather than sharing `NavbarProps`.

### Demo copy → stories

The current hardcoded copy is **moved into each section's `*.stories.tsx`** as realistic sample content. The Storybook showroom and the Vite explorer stay rich; the a11y test (renders each section's first story) renders meaningful content; products get only what they pass. No demo copy remains inside the section components.

### Testing & backward-compatibility

- Each section keeps its smoke test (renders all stories) and is covered by the a11y gate (first story). Stories now supply props, so tests pass.
- Add a focused test per section type asserting required content renders and `children` overrides the body.
- The catalog regenerates: sections gain rich prop documentation automatically (react-docgen reads the new `export interface`s) — a large side-benefit.

## Dark-by-default

```ts
useColorScheme(opts?: { defaultScheme?: 'system' | 'light' | 'dark' })  // default: 'system'
```
- When nothing is persisted, the initial preference is `opts.defaultScheme ?? 'system'` (so the **OS preference remains the default** unless a product opts in). A persisted user choice always wins.
- Templates expose a `DEFAULT_SCHEME` constant; the Next no-flash inline script and the Vite/Next theme-runtime read it, so a product can open dark before first paint without a flash. Default in the templates stays `'system'`.
- Documented in each template's `CLAUDE.md` alongside the accent theming.

## Catalog: utilities + literal unions

- **Utilities section** appended to `catalog/llms.txt`: a curated, hand-maintained-in-`scripts/gen-catalog.mjs` list of the public layout/typography classes (`.h-display`, `.h-section`, `.lede`, `.eyebrow`, `.muted`, `.row`, `.col`, `.container`, …) with one-line descriptions, so an agent building bespoke layout (or using a section's `children`) knows them. Marked clearly as "for custom layout — prefer components/sections first."
- **Literal unions**: fix `gen-catalog.mjs` so enum/union prop types render their members (`'solid' | 'glass' | 'flat'`) instead of `enum`. (Likely a `react-docgen-typescript` option or a post-process of `prop.type.value`.)
- Regenerate `catalog/llms.txt`; `release:preflight`'s drift gate keeps it honest.

## CONTEXT.md

Add two sections to `CONTEXT.md` (currently component-architecture only): (1) **Sections are content-driven** — the shared-props-per-type model, required/optional/`children`, `SectionAction`; (2) a brief **Distribution system** entry (package + catalog + templates + skills + theming) so the architecture doc reflects what the library now is. Keep it concise; link to the specs/plans.

## Out of scope (YAGNI)

- Per-variant prop types (shared-per-type is simpler and lets you swap variants without rewriting content).
- A CMS/content schema or i18n layer.
- Animating/visual redesign of sections — this is an API change, not a restyle.
- Making `onClick` actions work across the RSC boundary (use `href`, or a client wrapper).

## Success criteria

1. A product passes its own content to every section via props (`<HeroA title=… actions=… />`) and via `children`, with required fields enforced by the type-checker; no section ships placeholder copy unasked.
2. All 18 sections' stories + the a11y gate stay green; the showroom still shows rich sample content (now sourced from stories).
3. `catalog/llms.txt` documents section props (rich), the utility classes, and literal union types; `release:preflight` passes.
4. `useColorScheme({ defaultScheme: 'dark' })` + a template `DEFAULT_SCHEME` opens a brand dark with no flash; default behaviour stays system-following.
5. `CONTEXT.md` reflects the content-driven sections + distribution system.
6. The DJ-studio test rebuilt with real section content renders correctly (no placeholder copy), Next build clean.

## Sequencing (for the plan)

1. Smaller fixes first (independent, fast): catalog literal-unions; utilities in catalog; `useColorScheme({defaultScheme})` + template `DEFAULT_SCHEME`.
2. Section content model: shared helper types (`SectionAction`, item types) + the `children` pattern, proven on **Hero** first (template for the rest).
3. Sections in batches, each independently testable (stories updated, a11y green):
   - scalar/simple: Cta, Announcement, Marquee, Newsletter, NotFound.
   - item-array: Features, Pricing, Stats, Faq, Testimonials, TestimonialCarousel, Team, Blog, SocialProof, Comparison.
   - complex: Navbar (A/B/C + D), Footer.
4. Regenerate barrel + catalog; update CONTEXT.md; re-run the DJ-studio consumer test with real content.
