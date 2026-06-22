# Working in this product

This app consumes **Raditz**, a pre-built design-system package. Treat it as a
read-only dependency.

## Rules
- **Never edit `node_modules/raditz`.** Built output; edits are wiped on install.
- **Never re-implement a component that exists in Raditz.** Import it:
  `import { Button, HeroA } from 'raditz'`. The stylesheet is imported once in
  `app/layout.tsx` (App Router allows global CSS only in the root layout).
- **Discover components** in `node_modules/raditz/catalog/llms.txt`.
- Interactive Raditz components carry `"use client"`, so they work in Server
  Components. Dark mode: the inline no-flash script in `app/layout.tsx` sets the
  theme before paint; `app/theme-runtime.tsx` keeps it in sync.
- `transpilePackages` is NOT needed — Raditz ships built output.

## Composing a page
- **Sections are edge-to-edge (full-bleed) by default** — each brings its own inner
  gutter + max-width, so you just stack them. `app/layout.tsx` wraps everything once in
  `<div className="rdz-page">`, which pins the `Navbar` sticky and tidies page rhythm.
- A page is just an ordered list of sections (`<NavbarA/> <HeroA/> … <FooterA/>`).
  Put shared chrome (Navbar, Footer) in `app/layout.tsx`; per-route content in
  `app/<route>/page.tsx`. Don't hand-roll page padding — sections bring their own.
- For a **bespoke full-bleed band** (not one of the canned sections), use `SectionShell`
  (`background`/`image`/`scrim` + your children) — it owns the padding + constrained
  container, so you never write internal layout classes yourself.
- **No inline `style`/padding for layout.** Use the layout primitives
  (`Container`, `Section`, `Grid`, `Stack`) and section components.

## Brand / theming
- This project's tokens live in `app/theme.css` (imported AFTER `raditz/styles.css`).
  Set your accent by repointing `--accent-1..12` (a Radix scale or a custom hue);
  everything derives from it. Override any other token there too.
- For a live picker starting from your brand, call `useTheme({ accent: 'iris' })`
  in a client component. Don't combine the picker with a CSS accent override.
- Default colour scheme: set `DEFAULT_SCHEME` in the theme runtime (`'system'` follows
  the OS — the default; `'dark'` or `'light'` opens the site in that scheme, still
  user-toggleable). The Next no-flash script reads it so there's no flash.

## Motion / animation
- Scroll-reveal (`Reveal`, `RevealGroup`, section `animate`), title animations, and
  `AnimatedIcon` / `TextReveal` / `MotionCard` all ride the shared motion tokens and
  honour `prefers-reduced-motion` — use them, don't hand-roll animations.
- App-wide "vibe": set `data-reveal` / `data-title-anim` on `<html>` (fixed), or pass
  the axes to `useTheme({ reveal, titleAnim, motion })` (live, user-tunable).
- Building a custom animated/controllable component? Import the primitives from
  `'raditz'`: `useInView`, `useReducedMotion`, `useControllableState`, `cx`, `splitText`.
- A dashboard/docs layout → `AppShell` (`layout="sidebar" | "topbar"`, `side`, `density`,
  `collapsible`); feed it your nav once and swap layouts.

## Changing Raditz itself
- New reusable component → the **raditz-promote** workflow.
- Fix an existing component → `pnpm rdz:link`, fix in the library, release, `pnpm rdz:unlink`.
