import type { CSSProperties, ElementType, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx } from '../../internal';

export interface PopoutProps extends HTMLAttributes<HTMLElement> {
  /** Inner content max-width cap (matches Container). @default "default" */
  size?: 'default' | 'narrow' | 'wide' | 'prose';
  /** Full-bleed background — any CSS background value or token. @default "var(--accent-surface)" */
  bg?: string;
  /** Block padding on the content (spacing step 1–12). @default 11 */
  pad?: number;
  /** Add hairline top/bottom rules across the bleed. @default false */
  bordered?: boolean;
  /** Extra style for the inner (contained) content wrapper. */
  contentStyle?: CSSProperties;
  /** Element to render. @default "section" */
  as?: ElementType;
  children?: ReactNode;
}

/**
 * Full-bleed BACKGROUND, container-aligned CONTENT — the "popout" pattern.
 *
 * The element breaks out to span the full viewport width (so its background,
 * border bands and color ignore the page gutters), while the inner wrapper keeps
 * the content on the same max-width and gutters as the rest of the page. Use for
 * colored CTAs, feature strips and media bands inside a constrained Container.
 *
 * Built on the same `width:100vw; margin-inline: calc(50% - 50vw)` breakout as
 * FullBleed, plus an inner Container so you don't have to nest the two by hand.
 */
export function Popout({
  as = 'section',
  size = 'default',
  bg = 'var(--accent-surface)',
  pad = 11,
  bordered = false,
  className,
  style,
  contentStyle,
  children,
  ...rest
}: PopoutProps): ReactElement {
  const Tag = as;
  return (
    <Tag
      className={cx('rdz-popout', className)}
      data-bordered={bordered ? '' : undefined}
      style={{ '--rdz-popout-bg': bg, ...style } as CSSProperties}
      {...rest}
    >
      <div
        className="rdz-popout__content"
        data-size={size}
        style={{ '--rdz-popout-pad': `var(--space-${pad})`, ...contentStyle } as CSSProperties}
      >
        {children}
      </div>
    </Tag>
  );
}
