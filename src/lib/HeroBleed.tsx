import type { ReactNode } from 'react';
import { Frame } from './Frame';
import { cx } from '../components/internal';
import { SectionBackground } from '../components/layout/SectionBackground';
import type { SectionVariantProps } from './SectionShell';

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
 * HeroBleed — the "bleeding hero" shell. It paints ONE background (gradient /
 * surface / image / video) that fills the whole block — so it reaches the top
 * of the viewport BEHIND a transparent nav — then lays out a `nav` slot on top
 * and the hero content below it. The background mechanism is intentionally
 * decoupled from the hero content (children), so different hero designs can be
 * dropped in and still get the seamless nav-over-background effect.
 *
 * On a real page (`.srx-page`) this is the lead block; the nav sits over the same
 * wash as the hero instead of each having its own non-flowing background.
 */
export function HeroBleed({ background = 'gradient-aurora', parallax, image, video, scrim, nav, wrap, children }: HeroBleedProps) {
  const onMedia = !!image || !!video;
  return (
    <Frame className={cx('hero-bleed', onMedia && 'hero-bleed--media')}>
      <SectionBackground background={background} parallax={parallax} image={image} video={video} scrim={scrim ?? onMedia}>
        {nav ? <div className="hero-bleed__nav">{nav}</div> : null}
        <div className="s-pad hero-bleed__body">
          <div className={cx('s-wrap', wrap)}>{children}</div>
        </div>
      </SectionBackground>
    </Frame>
  );
}
