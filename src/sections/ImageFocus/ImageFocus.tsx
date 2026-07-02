import type { ReactNode } from 'react';
import { SectionShell, SectionActions, type SectionBaseProps, type SectionAction } from '../../lib/SectionShell';
import { cx } from '../../components/internal';

export interface ImageFocusProps extends SectionBaseProps {
  /** Full-bleed background image URL (required). */
  image: string;
  /** Eyebrow / kicker above the title. */
  eyebrow?: ReactNode;
  /** Headline. */
  title?: ReactNode;
  /** Sub-text under the title. */
  sub?: ReactNode;
  /** CTAs. */
  actions?: SectionAction[];
  /** Horizontal alignment of the text block. @default 'center' */
  align?: 'start' | 'center';
  /** Vertical placement of the text. @default 'center' */
  place?: 'center' | 'bottom';
  /** Band height: a tall 'hero', a medium 'band', or 'auto' (fits content). @default 'band' */
  size?: 'hero' | 'band' | 'auto';
  /** Title visual size. @default 'h-section' (an 'display' option reads hero-big). */
  titleSize?: 'section' | 'display';
}

/**
 * ImageFocus — a full-bleed image section with optional text over it. The one
 * component for both a media **hero** (with the page's nav bleeding over it) AND
 * an **inline** image band that gives a page some visual breathing room (image
 * alone, or image + a line of copy). The image always covers; the text block's
 * `align` (left/centre), `place` (centre/bottom) and `titleSize` are configurable
 * so the same component reads as a punchy hero or a quiet inline band.
 */
export function ImageFocus({
  image,
  eyebrow,
  title,
  sub,
  actions,
  align = 'center',
  place = 'center',
  size = 'band',
  titleSize = 'section',
  scrim = true,
  children,
  ...props
}: ImageFocusProps) {
  const hasText = !!(eyebrow || title || sub || (actions && actions.length) || children);
  return (
    <SectionShell
      image={image}
      scrim={scrim}
      frameClassName="rdz-imgfocus"
      frameData={{ 'data-size': size, 'data-place': place }}
      wrap={cx('col', align === 'center' ? 'sx-center' : 'sx-align-start', 'sx-gap-4', 'rdz-imgfocus__wrap')}
      {...props}
    >
      {children ?? (
        hasText ? (
          <>
            {eyebrow && <span className="eyebrow2">{eyebrow}</span>}
            {title && <h2 className={cx(titleSize === 'display' ? 'h-display' : 'h-section', 'rdz-imgfocus__title')}>{title}</h2>}
            {sub && <p className="lede sx-hero__lede">{sub}</p>}
            <SectionActions actions={actions} />
          </>
        ) : null
      )}
    </SectionShell>
  );
}
