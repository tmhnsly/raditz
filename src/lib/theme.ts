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

/** Corner roundness — scales every radius token via --radius-factor. */
export const RADII = ['sharp', 'default', 'round'] as const;
export type RadiusChoice = (typeof RADII)[number];
const RADIUS_FACTOR: Record<RadiusChoice, string> = { sharp: '0.5', default: '1.4', round: '2.6' };

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
  root.style.setProperty('--radius-factor', RADIUS_FACTOR[radius]);
  root.setAttribute('data-motion', motion);
}

const KEY = 'srx-theme';

interface ThemeState { accent: Accent; gray: GrayChoice; radius: RadiusChoice; motion: MotionChoice; }

const DEFAULTS: ThemeState = { accent: 'cyan', gray: 'auto', radius: 'default', motion: 'smooth' };

function load(): ThemeState {
  if (typeof localStorage !== 'undefined') {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || '');
      if (v && ACCENTS.includes(v.accent)) {
        return {
          accent: v.accent,
          gray: v.gray ?? 'auto',
          radius: RADII.includes(v.radius) ? v.radius : 'default',
          motion: MOTIONS.includes(v.motion) ? v.motion : 'smooth',
        };
      }
    } catch { /* ignore */ }
  }
  return DEFAULTS;
}

/** App-wide theme: pick an accent, gray (or 'auto'), corner radius, and motion
 * feel. Applies to <html> and persists to localStorage. */
export function useTheme() {
  const [state, setState] = useState<ThemeState>(load);
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
    reset: () => setState(DEFAULTS),
  };
}
