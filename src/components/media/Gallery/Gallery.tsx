'use client';
import * as React from 'react';
import { Lightbox } from '../Lightbox/Lightbox';
import type { LightboxImage } from '../Lightbox/Lightbox';
import { cx } from '../../internal';

const { useState } = React;

export interface GalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images?: LightboxImage[];
  /** Columns on wide screens (auto-collapses on small). @default 3 */
  columns?: number;
  /** Grid gap (CSS length). @default "var(--space-3)" */
  gap?: string;
  /** Cell aspect-ratio (e.g. "1", "4/3"), or "masonry" for natural heights. @default "1" */
  aspect?: string;
}

/**
 * Gallery — a responsive thumbnail grid that opens a Lightbox on click. Pass the
 * same `images` shape as Lightbox (`[{ src, thumb?, alt?, caption? }]`).
 * `columns` sets the grid (it auto-collapses on small screens); `aspect` sets
 * each cell's aspect-ratio (e.g. "1", "4/3", "3/4"), or "masonry" for natural
 * heights.
 */
export function Gallery({
  images = [],
  columns = 3,
  gap = 'var(--space-3)',
  aspect = '1',
  className,
  ...rest
}: GalleryProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const masonry = aspect === 'masonry';
  return (
    <div className={cx('rdz-gallery-wrap', className)} {...rest}>
      <div
        className={cx('rdz-gallery', masonry && 'rdz-gallery--masonry')}
        style={{ '--rdz-gallery-cols': columns, '--rdz-gallery-gap': gap } as React.CSSProperties}
      >
        {images.map((im, i) => (
          <button
            key={i}
            type="button"
            className="rdz-gallery__cell"
            style={masonry ? undefined : ({ '--rdz-gallery-aspect': aspect } as React.CSSProperties)}
            aria-label={im.alt || `Open image ${i + 1}`}
            onClick={() => {
              setIdx(i);
              setOpen(true);
            }}
          >
            <img src={im.thumb || im.src} alt={im.alt || ''} loading="lazy" />
          </button>
        ))}
      </div>
      <Lightbox images={images} open={open} onOpenChange={setOpen} index={idx} onIndexChange={setIdx} />
    </div>
  );
}
