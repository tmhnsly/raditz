'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';
import { Reveal, RevealGroup } from '../../components/motion/Reveal';
import { Card, type CardTone } from '../../components/surfaces/Card';
import { Vignette, type VignetteBg } from '../../components/surfaces/Vignette';
import { CardArrow } from '../../components/surfaces/CardArrow';
import { cx } from '../../components/internal';

export interface SpotlightItem {
  /** Card title (required). */
  title: ReactNode;
  /** Supporting line. */
  text?: ReactNode;
  /** Makes the whole card a link, with the top-right arrow. */
  href?: string;
  /** Force the external (up-right) arrow + new tab; auto-detected from an absolute href. */
  external?: boolean;
  /** The animated scene (an SVG). Plays once on reveal, again on hover — see Vignette. */
  scene: ReactNode;
  /** Vignette background treatment. @default 'gradient' */
  bg?: VignetteBg;
  /** Card surface tone. @default 'mono' */
  tone?: CardTone;
}

export interface SpotlightProps extends SectionBaseProps {
  /** Cards to render (required). */
  items: SpotlightItem[];
  eyebrow?: ReactNode;
  heading?: ReactNode;
}

/** One spotlight card. Owns a hover token passed to the Vignette so the scene
 *  replays whenever the card is hovered (it already played once on reveal). */
function SpotlightCard({ title, text, href, external, scene, bg = 'gradient', tone = 'mono' }: SpotlightItem) {
  const [hoverKey, setHoverKey] = useState(0);
  const clickable = !!href;
  const isExternal = external ?? /^(https?:)?\/\//.test(href ?? '');
  const linkAttrs = clickable && isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <Card
      tone={tone}
      as={clickable ? 'a' : 'div'}
      href={href}
      interactive={clickable}
      className={cx('rdz-spotlight__card', clickable && 'rdz-card-arrow-host')}
      onMouseEnter={() => setHoverKey((k) => k + 1)}
      {...linkAttrs}
    >
      <Vignette scene={scene} bg={bg} replay={hoverKey} className="rdz-spotlight__thumb" />
      <span className="rdz-spotlight__body">
        <strong className="rdz-spotlight__title">{title}</strong>
        {text ? <span className="rdz-spotlight__text">{text}</span> : null}
      </span>
      {clickable ? <CardArrow external={isExternal} className="rdz-card__arrow rdz-spotlight__arrow" /> : null}
    </Card>
  );
}

/**
 * Spotlight — a grid of "thumbnail cards": each pairs an animated {@link Vignette}
 * scene (plays on scroll-reveal, replays on hover, never loops) with a title, a
 * line of copy, a preset background and a top-right link arrow. The grid reveals
 * staggered on scroll. The scenes are product-supplied so each tells its own story.
 */
export function SpotlightA({ items, eyebrow, heading, ...props }: SpotlightProps) {
  return (
    <SectionShell wrap="col sx-gap-6" {...props} animate={false}>
      {(eyebrow || heading) && (
        <SectionHeader eyebrow={eyebrow} heading={heading} align="center" className="col sx-feat__head" />
      )}
      <RevealGroup className="rdz-spotlight__grid">
        {items.map((item, i) => (
          <Reveal key={i}>
            <SpotlightCard {...item} />
          </Reveal>
        ))}
      </RevealGroup>
    </SectionShell>
  );
}
