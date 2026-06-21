'use client';
import { useEffect, useState } from 'react';

// All Radix accent scales loaded in tokens/radix-colors.css.
export const ACCENTS = [
  'tomato', 'red', 'ruby', 'crimson', 'pink', 'plum', 'purple', 'violet',
  'iris', 'indigo', 'blue', 'cyan', 'sky', 'mint', 'teal', 'jade', 'green',
  'grass', 'lime', 'yellow', 'amber', 'orange', 'brown', 'bronze', 'gold',
] as const;
export type Accent = (typeof ACCENTS)[number];

// The six Radix grays (all loaded with alpha steps).
export const GRAYS = ['gray', 'mauve', 'slate', 'sage', 'olive', 'sand'] as const;
export type Gray = (typeof GRAYS)[number];

/** 'auto' = use the Radix-recommended gray for the chosen accent. */
export type GrayChoice = Gray | 'auto';

/** Radix's natural accent→gray pairing (from the Composing-a-palette docs). */
export const PAIRED_GRAY: Record<Accent, Gray> = {
  tomato: 'mauve', red: 'mauve', ruby: 'mauve', crimson: 'mauve', pink: 'mauve', plum: 'mauve', purple: 'mauve', violet: 'mauve',
  iris: 'slate', indigo: 'slate', blue: 'slate', sky: 'slate', cyan: 'slate',
  mint: 'sage', teal: 'sage', jade: 'sage', green: 'sage',
  grass: 'olive', lime: 'olive',
  yellow: 'sand', amber: 'sand', orange: 'sand', brown: 'sand', bronze: 'sand', gold: 'sand',
};

export function resolveGray(accent: Accent, choice: GrayChoice): Gray {
  return choice === 'auto' ? PAIRED_GRAY[accent] : choice;
}

/** Radix accents whose step 9/10 are LIGHT — they need dark foreground text
 * (the rest pair with white). From the Radix Colors "understanding the scale" docs. */
export const LIGHT_ACCENTS = new Set<Accent>(['sky', 'mint', 'lime', 'yellow', 'amber']);

/** Curated complement for the SECONDARY accent — a tasteful near-opposite hue so
 * the secondary always contrasts the accent, whichever you pick. Hand-tuned to
 * avoid the default semantic hues (grass/amber/red/blue) and the red family, so
 * the secondary never reads as success/warning/danger/info. */
export const COMPLEMENT: Record<Accent, Accent> = {
  tomato: 'teal', red: 'teal', ruby: 'teal', crimson: 'jade', pink: 'teal',
  plum: 'gold', purple: 'lime', violet: 'gold', iris: 'gold', indigo: 'gold',
  blue: 'gold', cyan: 'gold', sky: 'orange', mint: 'plum', teal: 'crimson',
  jade: 'crimson', green: 'plum', grass: 'purple', lime: 'violet', yellow: 'indigo',
  amber: 'indigo', orange: 'indigo', brown: 'teal', bronze: 'teal', gold: 'indigo',
};

/** Semantic hues stay conventional (green success, amber warning, red danger,
 * blue info) but resolve to a scale DISTINCT from the accent — so a green accent
 * doesn't blur into the green success, an amber accent into the warning, etc.
 * Ordered preference per family; the first scale that isn't the accent wins. */
const SEMANTIC_FAMILIES: Record<'success' | 'warning' | 'danger' | 'info', readonly Accent[]> = {
  success: ['grass', 'jade', 'green', 'teal'],
  warning: ['amber', 'gold', 'yellow', 'orange'],
  danger: ['red', 'tomato', 'ruby', 'crimson'],
  info: ['blue', 'indigo', 'sky', 'cyan'],
};
const pickAway = (family: readonly Accent[], accent: Accent): Accent => family.find((s) => s !== accent) ?? family[0];
/** Step-9 foreground: Radix's light solids (sky/mint/lime/yellow/amber) take dark text. */
const onSolid = (scale: Accent): string => (LIGHT_ACCENTS.has(scale) ? 'var(--black-a12)' : 'var(--white-a12)');

/** Corner roundness — scales every radius token via --radius-factor. */
export const RADII = ['sharp', 'default', 'round'] as const;
export type RadiusChoice = (typeof RADII)[number];
const RADIUS_FACTOR: Record<RadiusChoice, string> = { sharp: '0.5', default: '1.4', round: '2.0' };

/** Motion feel — maps to the token system's data-motion presets. */
export const MOTIONS = ['none', 'snappy', 'smooth', 'calm'] as const;
export type MotionChoice = (typeof MOTIONS)[number];

/** Title/heading entrance animation — applied app-wide (every section + hero
 * heading, and the <Heading> component) via a `data-title-anim` attribute on
 * <html>, exactly like `data-motion`. Default `none` keeps headings static. */
export const TITLE_ANIMS = ['none', 'fade', 'fade-up', 'blur-in', 'scale'] as const;
export type TitleAnimation = (typeof TITLE_ANIMS)[number];

/** Scroll-reveal entrance style — applied app-wide to `<Reveal>` (and section
 * `animate`) via a `data-reveal` attribute on <html>. A `<Reveal>` with no explicit
 * `anim` inherits this. */
export const REVEALS = ['none', 'fade', 'fade-rise', 'rise', 'scale', 'zoom', 'blur', 'flip'] as const;
export type RevealChoice = (typeof REVEALS)[number];

/** Named animation "vibes" — one pick sets a coordinated reveal + title + motion
 * personality for the whole app; the individual axes stay overridable after. */
export const VIBES = ['none', 'minimal', 'kinetic', 'editorial', 'playful'] as const;
export type VibeChoice = (typeof VIBES)[number];

export const VIBE_PRESETS: Record<VibeChoice, { reveal: RevealChoice; titleAnim: TitleAnimation; motion: MotionChoice }> = {
  none:      { reveal: 'none',      titleAnim: 'none',    motion: 'smooth' },
  minimal:   { reveal: 'fade',      titleAnim: 'fade',    motion: 'smooth' },
  kinetic:   { reveal: 'rise',      titleAnim: 'fade-up', motion: 'snappy' },
  editorial: { reveal: 'blur',      titleAnim: 'blur-in', motion: 'calm' },
  playful:   { reveal: 'zoom',      titleAnim: 'scale',   motion: 'snappy' },
};

/** Pure palette resolution: returns the full set of CSS custom properties that
 * applyTheme writes, as a plain Record. No DOM side-effects. Reusable for SSR
 * and preview contexts. Values stay as var() references so a `.dark` toggle
 * keeps flipping them. */
export function themeVars(state: Partial<ThemeState> = {}): Record<string, string> {
  const { accent = DEFAULTS.accent, gray: choice = DEFAULTS.gray, radius = DEFAULTS.radius } = state;
  const vars: Record<string, string> = {};
  const gray = resolveGray(accent, choice);

  for (let i = 1; i <= 12; i++) {
    vars[`--accent-${i}`] = `var(--${accent}-${i})`;
    vars[`--neutral-${i}`] = `var(--${gray}-${i})`;
  }
  for (let i = 1; i <= 6; i++) {
    vars[`--neutral-a${i}`] = `var(--${gray}-a${i})`;
  }
  // Light accents (sky/mint/lime/yellow/amber) need dark text on their step 9/10.
  vars['--on-accent'] = LIGHT_ACCENTS.has(accent) ? 'var(--black-a12)' : 'var(--white-a12)';

  // Secondary accent — a curated complement of the accent (gradient backgrounds +
  // the --accent-2 tokens), so it always pairs regardless of which accent is set.
  const comp = COMPLEMENT[accent];
  vars['--accent-2-solid'] = `var(--${comp}-9)`;
  vars['--accent-2-ink'] = `var(--${comp}-11)`;
  vars['--accent-2-surface'] = `var(--${comp}-3)`;

  // Semantic palette — conventional hue, but a scale distinct from the accent so
  // a green accent doesn't collide with the green success (etc.). Choose one and
  // it derives the rest.
  for (const name of ['success', 'warning', 'danger', 'info'] as const) {
    const scale = pickAway(SEMANTIC_FAMILIES[name], accent);
    vars[`--${name}`] = `var(--${scale}-9)`;
    vars[`--${name}-ink`] = `var(--${scale}-11)`;
    vars[`--${name}-surface`] = `var(--${scale}-3)`;
    vars[`--on-${name}`] = onSolid(scale);
  }

  vars['--radius-factor'] = RADIUS_FACTOR[radius];
  return vars;
}

/** Write a theme to <html>: the accent + neutral ramps + radius factor (as CSS vars,
 * kept as var() refs so a `.dark` toggle keeps flipping them) plus the motion /
 * title-anim / reveal data-attributes. Takes the axes as an OBJECT — omitted fields
 * fall back to the defaults, and adding a new axis never re-orders a call site. */
export function applyTheme(state: Partial<ThemeState> = {}): void {
  if (typeof document === 'undefined') return;
  const s: ThemeState = { ...DEFAULTS, ...state };
  const root = document.documentElement;
  const vars = themeVars(s);
  for (const [k, val] of Object.entries(vars)) root.style.setProperty(k, val);
  root.setAttribute('data-motion', s.motion);
  root.setAttribute('data-title-anim', s.titleAnim);
  root.setAttribute('data-reveal', s.reveal);
}

/** Apply the persisted (or default) theme to <html> immediately — call once at app
 * start (before render) so a saved accent / vibe / reveal / title shows on first
 * paint, without waiting for the ThemePicker to mount. */
export function applyStoredTheme(projectDefaults?: ThemeDefaults): void {
  applyTheme(load(projectDefaults));
}

const KEY = 'rdz-theme';

interface ThemeState { accent: Accent; gray: GrayChoice; radius: RadiusChoice; motion: MotionChoice; titleAnim: TitleAnimation; reveal: RevealChoice; }

const DEFAULTS: ThemeState = { accent: 'cyan', gray: 'auto', radius: 'default', motion: 'smooth', titleAnim: 'none', reveal: 'fade-rise' };

/** Project-level theme baseline a consuming product can pass to useTheme(). */
export type ThemeDefaults = {
  accent?: Accent;
  gray?: GrayChoice;
  radius?: RadiusChoice;
  motion?: MotionChoice;
  titleAnim?: TitleAnimation;
  reveal?: RevealChoice;
};

function load(projectDefaults?: ThemeDefaults): ThemeState {
  const base: ThemeState = { ...DEFAULTS, ...projectDefaults };
  if (typeof localStorage !== 'undefined') {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || '');
      if (v && ACCENTS.includes(v.accent)) {
        return {
          accent: v.accent,
          gray: v.gray ?? base.gray,
          radius: RADII.includes(v.radius) ? v.radius : base.radius,
          motion: MOTIONS.includes(v.motion) ? v.motion : base.motion,
          titleAnim: TITLE_ANIMS.includes(v.titleAnim) ? v.titleAnim : base.titleAnim,
          reveal: REVEALS.includes(v.reveal) ? v.reveal : base.reveal,
        };
      }
    } catch { /* ignore */ }
  }
  return base;
}

/** App-wide theme: pick an accent, gray (or 'auto'), corner radius, and motion
 * feel. Applies to <html> and persists to localStorage. A product may pass its
 * brand baseline via `projectDefaults` (used until the user picks something). */
export function useTheme(projectDefaults?: ThemeDefaults) {
  const [state, setState] = useState<ThemeState>(() => load(projectDefaults));
  useEffect(() => {
    applyTheme(state);
    if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);
  return {
    accent: state.accent,
    gray: state.gray,
    radius: state.radius,
    motion: state.motion,
    titleAnim: state.titleAnim,
    reveal: state.reveal,
    setAccent: (accent: Accent) => setState((s) => ({ ...s, accent })),
    setGray: (gray: GrayChoice) => setState((s) => ({ ...s, gray })),
    setRadius: (radius: RadiusChoice) => setState((s) => ({ ...s, radius })),
    setMotion: (motion: MotionChoice) => setState((s) => ({ ...s, motion })),
    setTitleAnim: (titleAnim: TitleAnimation) => setState((s) => ({ ...s, titleAnim })),
    setReveal: (reveal: RevealChoice) => setState((s) => ({ ...s, reveal })),
    /** Apply a named vibe — sets reveal + titleAnim + motion in one go. */
    setVibe: (vibe: VibeChoice) => setState((s) => ({ ...s, ...VIBE_PRESETS[vibe] })),
    reset: () => setState({ ...DEFAULTS, ...projectDefaults }),
  };
}
