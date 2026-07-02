import type { ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

/**
 * @startingPoint section="Surfaces" subtitle="Cards, callouts, separators & avatars" viewport="700x380"
 */
/** Brand-colored card treatments (formerly MotionCard's `tone`). Each sets a
 *  tinted background plus the `--card-ink` / `--card-arrow` pairing custom
 *  properties that `.rdz-card__eyebrow`/`__icon`/`__arrow` consume — both take the
 *  tone's own hue (secondary → gold, accent/aurora/dusk/glass → accent ink; mono
 *  keeps the accent pop), so the eyebrow, icon and arrow harmonise with the card. */
export type CardTone = 'accent' | 'secondary' | 'aurora' | 'dusk' | 'glass' | 'mono';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Surface style. @default "solid" */
  variant?: 'solid' | 'glass' | 'flat';
  /** Brand-colored treatment — a soft accent / secondary / mono / gradient tint
   *  with matched ink + arrow colors. */
  tone?: CardTone;
  /** Add a hover lift for clickable cards. @default false */
  interactive?: boolean;
  as?: ElementType;
  /** Anchor attrs for a clickable card (`as="a"`). */
  href?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
}

/**
 * The base surface. `variant` is "solid" (default), "glass" (frosted blur) or
 * "flat" (no shadow). `tone` paints a brand-colored treatment (accent / secondary
 * / aurora / dusk / glass / mono) and sets the ink/arrow pairing for any
 * `.rdz-card__*` children. `interactive` adds a hover lift for clickable cards.
 */
export function Card({
  variant = 'solid',
  tone,
  interactive = false,
  as = 'div',
  className,
  children,
  ...rest
}: CardProps): ReactElement {
  const Tag = as;
  const cls = cx(
    'rdz-card',
    interactive && 'rdz-card--interactive',
    className,
  );
  return (
    <Tag className={cls} data-variant={variant} data-tone={tone} {...rest}>
      {children}
    </Tag>
  );
}
