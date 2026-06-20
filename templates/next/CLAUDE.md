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

## Brand / theming
- This project's tokens live in `app/theme.css` (imported AFTER `raditz/styles.css`).
  Set your accent by repointing `--accent-1..12` (a Radix scale or a custom hue);
  everything derives from it. Override any other token there too.
- For a live picker starting from your brand, call `useTheme({ accent: 'iris' })`
  in a client component. Don't combine the picker with a CSS accent override.

## Changing Raditz itself
- New reusable component → the **raditz-promote** workflow.
- Fix an existing component → `pnpm rdz:link`, fix in the library, release, `pnpm rdz:unlink`.
