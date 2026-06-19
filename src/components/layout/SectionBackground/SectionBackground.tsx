import { useEffect, useRef } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

/** Templated background fills (all token-driven, so they re-theme). */
export type SectionBg =
  | 'none'        // plain — inherits the page (fast default for wireframing)
  | 'surface'     // neutral step 1 (the app canvas)
  | 'surface-2'   // neutral step 2 — alternate sections to differentiate them
  | 'gradient-accent'  // the soft accent wash (like the pricing-page nav)
  | 'gradient-aurora'  // multi-point accent + secondary blend
  | 'gradient-dusk'    // accent → secondary diagonal
  | 'gradient-mesh';   // layered radial mesh

export interface SectionBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Background fill. @default 'none' */
  background?: SectionBg;
  /** Image URL — painted as a cover layer (overrides the gradient). */
  image?: string;
  /** Video URL — autoplaying muted cover layer (overrides image + gradient). */
  video?: string;
  /** Subtle scroll parallax on the media/gradient layer. @default false */
  parallax?: boolean;
  /** Darken the backdrop (image/video/gradient) so overlaid text stays legible. */
  scrim?: boolean;
  children?: ReactNode;
}

const GRADIENTS = new Set<SectionBg>(['gradient-accent', 'gradient-aurora', 'gradient-dusk', 'gradient-mesh']);

/**
 * SectionBackground — an optional decorative backdrop for a section: a neutral
 * surface level (alternate `surface`/`surface-2` to differentiate sections), a
 * templated gradient, or an image/video — with optional scroll parallax. Content
 * sits above the layer, so glass/translucent panels finally have something to sit
 * over. Default is `none` (plain, fast) so wireframing stays quick; flourishes
 * are opt-in. All gradients are token-driven and re-theme with the accent.
 */
export function SectionBackground({
  background = 'none',
  image,
  video,
  parallax = false,
  scrim = false,
  className,
  children,
  ...rest
}: SectionBackgroundProps): ReactElement {
  const layerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hasLayer = !!image || !!video || GRADIENTS.has(background);

  useEffect(() => {
    if (!parallax || !hasLayer) return undefined;
    const root = rootRef.current;
    const layer = layerRef.current;
    if (!root || !layer) return undefined;
    let raf = 0;
    const onScroll = (): void => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const offset = (rect.top / window.innerHeight) * -32; // px, gentle
        layer.style.setProperty('--srx-parallax-y', `${offset.toFixed(1)}px`);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [parallax, hasLayer]);

  return (
    <div
      ref={rootRef}
      className={cx('srx-secbg', background !== 'none' && `srx-secbg--${background}`, GRADIENTS.has(background) && 'srx-secbg--gradient', parallax && 'srx-secbg--parallax', scrim && 'srx-secbg--scrim', className)}
      {...rest}
    >
      {hasLayer ? (
        <div className="srx-secbg__layer" ref={layerRef} aria-hidden="true">
          {video ? (
            <video src={video} autoPlay muted loop playsInline />
          ) : image ? (
            <img src={image} alt="" />
          ) : null}
        </div>
      ) : null}
      {/* A scrim darkens the backdrop, so the surface OWNS its on-dark context —
          content gets legible on-media tokens without the caller adding a class. */}
      <div className={cx('srx-secbg__content', scrim && 'srx-on-dark')}>{children}</div>
    </div>
  );
}
