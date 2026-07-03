import type { ReactNode } from 'react';
import {
  SectionShell,
  SectionHeader,
  SectionActionButton,
  type SectionBaseProps,
  type SectionAction,
} from '../../lib/SectionShell';

export interface StorySplitItem {
  /** Image URL for the media pane (covers, clipped to the card radius). */
  image?: string;
  /** Alt text for `image`. Omit (or pass '') only for purely decorative images. */
  imageAlt?: string;
  /** Custom media node — takes precedence over `image` (same clipped 4/3 frame). */
  media?: ReactNode;
  /** Mono kicker above the row title. */
  eyebrow?: ReactNode;
  /** Row title (required). */
  title: ReactNode;
  /** Supporting copy. */
  body?: ReactNode;
  /** Optional CTA under the copy. */
  action?: SectionAction;
}

export interface StorySplitProps extends SectionBaseProps {
  /** Editorial rows to render (required). */
  items: StorySplitItem[];
  /** Small label above the section heading. */
  eyebrow?: ReactNode;
  /** Section heading. */
  heading?: ReactNode;
  /** Align the heading block: 'center' or 'start' (left). Omit for the default look. */
  align?: 'start' | 'center';
}

/**
 * StorySplit A — alternating editorial rows: each pairs a media pane (an image
 * that covers, or a custom `media` node) with an eyebrow + title + body + CTA
 * copy column. DOM order stays media → copy (reading order) on every row; even
 * rows flip the media to the right purely presentationally via a `data-flip`
 * attribute the stylesheet turns into grid `order` — and the flip resets when
 * the rows stack on narrow containers, so media always sits above its copy.
 */
export function StorySplitA({ items, eyebrow, heading, align, children, ...props }: StorySplitProps) {
  return (
    <SectionShell wrap="col sx-gap-6" {...props}>
      {children ?? (
        <>
          <SectionHeader eyebrow={eyebrow} heading={heading} align={align} className="col sx-feat__head" />
          <div className="col sx-story__rows">
            {items.map((item, i) => {
              const media =
                item.media ??
                (item.image ? (
                  <img className="sx-story__img" src={item.image} alt={item.imageAlt ?? ''} loading="lazy" />
                ) : null);
              return (
                <div key={i} className="sx-story__row" data-flip={i % 2 === 1 ? '' : undefined}>
                  {media && <div className="sx-story__media">{media}</div>}
                  <div className="col sx-gap-3 sx-story__copy">
                    {item.eyebrow && <span className="eyebrow2">{item.eyebrow}</span>}
                    <h3 className="h-section sx-story__title">{item.title}</h3>
                    {item.body && <p className="muted sx-lh-body">{item.body}</p>}
                    {item.action && <SectionActionButton action={item.action} className="sx-story__action" />}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </SectionShell>
  );
}
