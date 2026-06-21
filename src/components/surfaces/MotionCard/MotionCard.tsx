'use client';
import * as React from 'react';
import { cx } from '../../internal';
import { Reveal, type RevealAnim } from '../../utility/Reveal';
import { AnimatedIcon, type IconAnim } from '../../utility/AnimatedIcon';
import { CardArrow } from '../../utility/CardArrow';

export type MotionCardTone = 'accent' | 'secondary' | 'aurora' | 'dusk' | 'glass' | 'mono';

export interface MotionCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Brand-colored treatment. @default 'accent' */
  tone?: MotionCardTone;
  /** Mono eyebrow label. */
  eyebrow?: React.ReactNode;
  /** Card title (required). */
  title: React.ReactNode;
  /** Optional looping icon (a react-icons glyph, Raditz `<Icon/>`, or SVG). */
  icon?: React.ReactNode;
  /** Animation for `icon`. @default 'float' */
  iconAnim?: IconAnim;
  /** Link target — makes the card a clickable `<a>` with the arrow affordance. */
  href?: string;
  /** Force the external (up-right) arrow + open-in-new-tab. Auto-detected from an
   *  absolute `href` when omitted. */
  external?: boolean;
  /** Scroll-reveal entrance. Omit to inherit the app-wide reveal vibe. */
  reveal?: RevealAnim;
  /** Stagger index when several MotionCards reveal together. */
  index?: number;
  children?: React.ReactNode;
}

/**
 * MotionCard — a ready-made, brand-colored animated card. Pulls the system's
 * accent / secondary / gradient / glass / mono treatments (`tone`), reveals on
 * scroll, can loop an icon, and — when given an `href` — shows the consistent
 * clickable-card arrow. A tasteful default composition of Card + Reveal +
 * AnimatedIcon + CardArrow, so products get a polished card with no wiring.
 */
export function MotionCard({
  tone = 'accent',
  eyebrow,
  title,
  icon,
  iconAnim = 'float',
  href,
  external,
  reveal,
  index,
  className,
  children,
  ...rest
}: MotionCardProps): React.ReactElement {
  const clickable = !!href;
  const isExternal = external ?? /^(https?:)?\/\//.test(href ?? '');
  const Tag = (clickable ? 'a' : 'div') as React.ElementType;
  const linkAttrs = clickable && isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const inner = React.createElement(
    Tag,
    {
      href,
      ...linkAttrs,
      className: cx('rdz-motion-card', `rdz-motion-card--${tone}`, clickable && 'rdz-card-arrow-host', className),
      ...rest,
    },
    <>
      {icon ? <AnimatedIcon anim={iconAnim} className="rdz-motion-card__icon">{icon}</AnimatedIcon> : null}
      {eyebrow ? <span className="rdz-motion-card__eyebrow">{eyebrow}</span> : null}
      <strong className="rdz-motion-card__title">{title}</strong>
      {children ? <span className="rdz-motion-card__body">{children}</span> : null}
      {clickable ? <CardArrow external={isExternal} className="rdz-motion-card__arrow" /> : null}
    </>,
  );
  return (
    <Reveal anim={reveal} index={index} className="rdz-motion-card-wrap">
      {inner}
    </Reveal>
  );
}
