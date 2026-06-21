# Working in this product

This app consumes **Raditz**, a pre-built design-system package. Treat it as a
read-only dependency.

## Rules
- **Never edit `node_modules/raditz`.** It is built output; edits are wiped on install.
- **Never re-implement a component that exists in Raditz.** Import it:
  `import { Button, HeroA } from 'raditz'`. The stylesheet is imported once in
  `src/main.tsx`: `import 'raditz/styles.css'`.
- **Discover components** in `node_modules/raditz/catalog/llms.txt`.
- Dark mode is wired in `src/ThemeRuntime.tsx` (`useColorScheme`).

## Brand / theming
- This project's tokens live in `src/theme.css` (imported AFTER `raditz/styles.css`).
  Set your accent by repointing the `--accent-1..12` ramp (built-in Radix scale or a
  custom hue) — everything derives from it. Override any other token there too.
- For a live theme picker that starts from your brand, call
  `useTheme({ accent: 'iris' })` from a client component (see `ThemeRuntime.tsx`).
  Do not use both the picker AND a CSS accent override — the picker's inline styles win.
- Default colour scheme: set `DEFAULT_SCHEME` in the theme runtime (`'system'` follows
  the OS — the default; `'dark'` or `'light'` opens the site in that scheme, still
  user-toggleable). Vite has no SSR pre-paint script, so the hook applies it on mount.

## Motion / animation
- Scroll-reveal (`Reveal`, `RevealGroup`, section `animate`), title animations, and
  `AnimatedIcon` / `TextReveal` / `MotionCard` ride the shared motion tokens and honour
  `prefers-reduced-motion` — use them, don't hand-roll animations.
- App-wide "vibe": set `data-reveal` / `data-title-anim` on `<html>` (fixed), or pass the
  axes to `useTheme({ reveal, titleAnim, motion })` (live, user-tunable).
- Building a custom animated/controllable component? Import the primitives from `'raditz'`:
  `useInView`, `useReducedMotion`, `useControllableState`, `cx`, `splitText`.
- A dashboard/docs layout → `AppShell` (`layout="sidebar" | "topbar"`, `side`, `density`,
  `collapsible`); feed it your nav once and swap layouts.

## Changing Raditz itself
Do it in the library repo, not here:
- A brand-new reusable component → the **raditz-promote** workflow.
- A fix to an existing component → `pnpm rdz:link`, fix in the library, cut a
  release, then `pnpm rdz:unlink`.
