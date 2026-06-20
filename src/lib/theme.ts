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

/** Repoint the accent + neutral ramps on <html> to the chosen Radix scales, and
 * set the radius factor + motion preset. Values stay as var() references so a
 * `.dark` toggle keeps flipping them. */
export function applyTheme(accent: Accent, choice: GrayChoice, radius: RadiusChoice = 'default', motion: MotionChoice = 'smooth'): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const gray = resolveGray(accent, choice);
  for (let i = 1; i <= 12; i++) {
    root.style.setProperty(`--accent-${i}`, `var(--${accent}-${i})`);
    root.style.setProperty(`--neutral-${i}`, `var(--${gray}-${i})`);
  }
  for (let i = 1; i <= 6; i++) {
    root.style.setProperty(`--neutral-a${i}`, `var(--${gray}-a${i})`);
  }
  // Light accents (sky/mint/lime/yellow/amber) need dark text on their step 9/10.
  root.style.setProperty('--on-accent', LIGHT_ACCENTS.has(accent) ? 'var(--black-a12)' : 'var(--white-a12)');

  // Secondary accent — a curated complement of the accent (gradient backgrounds +
  // the --accent-2 tokens), so it always pairs regardless of which accent is set.
  const comp = COMPLEMENT[accent];
  root.style.setProperty('--accent-2-solid', `var(--${comp}-9)`);
  root.style.setProperty('--accent-2-ink', `var(--${comp}-11)`);
  root.style.setProperty('--accent-2-surface', `var(--${comp}-3)`);

  // Semantic palette — conventional hue, but a scale distinct from the accent so
  // a green accent doesn't collide with the green success (etc.). Choose one and
  // it derives the rest.
  for (const name of ['success', 'warning', 'danger', 'info'] as const) {
    const scale = pickAway(SEMANTIC_FAMILIES[name], accent);
    root.style.setProperty(`--${name}`, `var(--${scale}-9)`);
    root.style.setProperty(`--${name}-ink`, `var(--${scale}-11)`);
    root.style.setProperty(`--${name}-surface`, `var(--${scale}-3)`);
    root.style.setProperty(`--on-${name}`, onSolid(scale));
  }

  root.style.setProperty('--radius-factor', RADIUS_FACTOR[radius]);
  root.setAttribute('data-motion', motion);
}

const KEY = 'rdz-theme';

interface ThemeState { accent: Accent; gray: GrayChoice; radius: RadiusChoice; motion: MotionChoice; }

const DEFAULTS: ThemeState = { accent: 'cyan', gray: 'auto', radius: 'default', motion: 'smooth' };

/** Project-level theme baseline a consuming product can pass to useTheme(). */
export type ThemeDefaults = {
  accent?: Accent;
  gray?: GrayChoice;
  radius?: RadiusChoice;
  motion?: MotionChoice;
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
    applyTheme(state.accent, state.gray, state.radius, state.motion);
    if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);
  return {
    accent: state.accent,
    gray: state.gray,
    radius: state.radius,
    motion: state.motion,
    setAccent: (accent: Accent) => setState((s) => ({ ...s, accent })),
    setGray: (gray: GrayChoice) => setState((s) => ({ ...s, gray })),
    setRadius: (radius: RadiusChoice) => setState((s) => ({ ...s, radius })),
    setMotion: (motion: MotionChoice) => setState((s) => ({ ...s, motion })),
    reset: () => setState({ ...DEFAULTS, ...projectDefaults }),
  };
}
