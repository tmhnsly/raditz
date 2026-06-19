import type { ReactNode } from 'react';
import { Frame } from './Frame';
import { cx } from '../components/internal';
import { SectionBackground } from '../components/layout/SectionBackground';
import type { SectionBg } from '../components/layout/SectionBackground/SectionBackground';

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
