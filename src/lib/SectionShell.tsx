import type { ReactElement, ReactNode } from 'react';
import { Frame } from './Frame';
import { cx } from '../components/internal';
import { SectionBackground } from '../components/layout/SectionBackground';
import type { SectionBg } from '../components/layout/SectionBackground/SectionBackground';
import { Button, type ButtonProps } from '../components/controls/Button';
import type { IconName } from '../components/foundation/Icon/Icon';

export type { SectionBg } from '../components/layout/SectionBackground/SectionBackground';

/** Background controls every section variant accepts, so backgrounds are
 * configurable per instance (with a curated default) — not hard-wired. */
export interface SectionVariantProps {
  background?: SectionBg;
  parallax?: boolean;
  image?: string;
  video?: string;
}

export interface SectionShellProps {
  /** Extra classes on the inner `.s-wrap` (grid + gap, e.g. "sx-g3 sx-gap-5"). */
  wrap?: string;
  /** Section padding. @default "default" */
  pad?: 'default' | 'sm' | 'none';
  /** Extra classes on the padding element (e.g. a section band background). */
  padClassName?: string;
  /** Optional decorative backdrop (composes SectionBackground). @default "none" */
  background?: SectionBg;
  /** Parallax the backdrop. @default false */
  parallax?: boolean;
  /** Image URL backdrop (overrides gradient). */
  image?: string;
  /** Video URL backdrop (overrides image + gradient). */
  video?: string;
  /** Darken the backdrop (scrim); the surface then scopes content to on-dark. */
  scrim?: boolean;
  /** A transparent nav rendered above the content, floating over the shared
   * background (the "hero bleed" effect). Pass a nav with no background. */
  nav?: ReactNode;
  /** Class on the preview Frame (e.g. "nav-frame", "ph--neutral"). */
  frameClassName?: string;
  /** Constrain the Frame width. */
  frameMaxWidth?: string;
  children?: ReactNode;
}

/**
 * SectionShell — the one home for the section layout boilerplate every section
 * variant used to repeat: the preview Frame + `.s-pad` padding + `.s-wrap`
 * max-width wrapper (where the responsive container-query lives), with an
 * optional SectionBackground. Sections become content + a shell choice instead
 * of re-typing the triple-nested wrapper ~50 times.
 */
export function SectionShell({
  wrap,
  pad = 'default',
  padClassName,
  background = 'none',
  parallax = false,
  image,
  video,
  scrim = false,
  nav,
  frameClassName,
  frameMaxWidth,
  children,
}: SectionShellProps) {
  const padClass = pad === 'sm' ? 's-pad-sm' : pad === 'none' ? undefined : 's-pad';
  const inner = (
    <>
      {nav ? <div className="section-shell__nav">{nav}</div> : null}
      <div className={cx(padClass, padClassName)}>
        <div className={cx('s-wrap', wrap)}>{children}</div>
      </div>
    </>
  );
  const hasBg = background !== 'none' || !!image || !!video;
  return (
    <Frame className={frameClassName} maxWidth={frameMaxWidth}>
      {hasBg ? (
        <SectionBackground background={background} parallax={parallax} image={image} video={video} scrim={scrim}>{inner}</SectionBackground>
      ) : (
        inner
      )}
    </Frame>
  );
}

/**
 * A call-to-action a section renders as a {@link Button}. Prefer `href`
 * (Server-Component-safe) over `onClick` (which requires a client boundary).
 * Shared by every content-driven section's `actions` prop.
 */
export type SectionAction = {
  /** Visible button text. */
  label: string;
  /** Link target — renders an `<a>`. */
  href?: string;
  /** Click handler — renders a `<button>` (needs a client boundary). */
  onClick?: () => void;
  /** Button visual weight. @default Button's own default ("primary") */
  variant?: ButtonProps['variant'];
  /** Per-action size override (else inherits the `SectionActions` size). */
  size?: ButtonProps['size'];
  /** Leading icon — a registry name or a node. */
  icon?: IconName | ReactNode;
};

/**
 * The props every content-driven section variant accepts: the decorative
 * backdrop options ({@link SectionVariantProps}) plus a `children` escape hatch
 * that, when provided, replaces the section's auto-rendered body. Section prop
 * interfaces (e.g. `HeroProps`) extend this and add their content fields.
 */
export type SectionBaseProps = SectionVariantProps & {
  /** Replaces the auto-rendered body inside the themed shell when provided. */
  children?: ReactNode;
};

/**
 * Renders a row of CTAs from `actions` as {@link Button}s. Returns `null` when
 * there are no actions, so callers can drop it in unconditionally. `size` sets
 * the default for every button (each action may override via its own `size`).
 * The shared CTA renderer for all content-driven sections.
 */
export function SectionActions({
  actions,
  size,
  className = 'row sx-row-center',
}: {
  /** The CTAs to render. */
  actions?: SectionAction[];
  /** Default size applied to every button (per-action `size` wins). */
  size?: ButtonProps['size'];
  /** Class on the wrapping row. @default "row sx-row-center" */
  className?: string;
}): ReactElement | null {
  if (!actions || actions.length === 0) return null;
  return (
    <div className={className}>
      {actions.map((action, i) => (
        <Button
          key={action.href ?? action.label ?? i}
          href={action.href}
          onClick={action.onClick}
          variant={action.variant}
          size={action.size ?? size}
          icon={action.icon}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
