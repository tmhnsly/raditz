import type { ReactNode } from 'react';
import { SectionShell, type SectionVariantProps } from './SectionShell';

export interface HeroBleedProps extends SectionVariantProps {
  /** A transparent nav rendered at the very top, floating over the shared
   * background (pass a nav with no background of its own). */
  nav?: ReactNode;
  /** Darken the backdrop for legible text. Defaults on when image/video is set. */
  scrim?: boolean;
  /** Extra classes on the hero content's `.s-wrap`. */
  wrap?: string;
  /** The hero content — any design; the bleed mechanism is decoupled from it. */
  children?: ReactNode;
}

/**
 * HeroBleed — a thin preset of {@link SectionShell}: one background fills the
 * block (default a gradient) so it reaches the top BEHIND a transparent `nav`
 * slot, with the hero content below. The bleed mechanism is decoupled from the
 * content, so any hero design slots in. Media auto-scrims (and SectionShell then
 * scopes the content to the on-dark context). It's a named preset, not its own
 * Frame/SectionBackground/padding stack — that all lives in SectionShell.
 */
export function HeroBleed({ background = 'gradient-aurora', parallax, image, video, scrim, nav, wrap, children }: HeroBleedProps) {
  const onMedia = !!image || !!video;
  return (
    <SectionShell
      frameClassName="hero-bleed"
      background={background}
      parallax={parallax}
      image={image}
      video={video}
      scrim={scrim ?? onMedia}
      nav={nav}
      wrap={wrap}
    >
      {children}
    </SectionShell>
  );
}
