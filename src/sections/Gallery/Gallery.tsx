import type { ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';
import { Gallery as GalleryGrid, type GalleryProps as GalleryGridProps } from '../../components/media/Gallery';
import { cx } from '../../components/internal';

export interface GallerySectionProps extends SectionBaseProps {
  /** Images to render (required). `alt` is mandatory — gallery imagery is content,
   * not decoration. `caption` shows under each figure in GalleryB (and in the
   * GalleryA lightbox viewer). */
  images: { src: string; alt: string; caption?: ReactNode }[];
  /** Kicker line above the heading. */
  eyebrow?: ReactNode;
  /** Section heading. */
  heading?: ReactNode;
  /** Supporting line under the heading. */
  lede?: ReactNode;
  /** Align the header block: 'center' or 'start' (left). @default 'start' */
  align?: 'start' | 'center';
  /** Grid columns, forwarded to the media Gallery (GalleryA only). @default 3 */
  columns?: GalleryGridProps['columns'];
  /** Cell aspect-ratio, forwarded to the media Gallery (GalleryA only). @default "1" */
  aspect?: GalleryGridProps['aspect'];
}

/** The eyebrow/heading/lede block both gallery variants share. Returns `null`
 * when there is no header content, so callers drop it in unconditionally. */
function GalleryHead({
  eyebrow,
  heading,
  lede,
  align,
}: Pick<GallerySectionProps, 'eyebrow' | 'heading' | 'lede' | 'align'>) {
  if (!eyebrow && !heading && !lede) return null;
  return (
    <div className={cx('col sx-gal__head', align === 'center' && 'sx-center')}>
      <SectionHeader eyebrow={eyebrow} heading={heading} className="col sx-gal__head-text" />
      {lede && <p className="lede sx-gal__lede">{lede}</p>}
    </div>
  );
}

/** Gallery A — header + lightbox grid. Composes the media {@link GalleryGrid}
 * component (grid + Lightbox), forwarding `columns`/`aspect` — no duplicate
 * grid/lightbox machinery here. */
export function GalleryA({
  images,
  eyebrow,
  heading,
  lede,
  align,
  columns,
  aspect,
  background = 'none',
  children,
  ...props
}: GallerySectionProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <GalleryHead eyebrow={eyebrow} heading={heading} lede={lede} align={align} />
          <GalleryGrid className="sx-gal__grid" images={images} columns={columns} aspect={aspect} />
        </>
      )}
    </SectionShell>
  );
}

/** Gallery B — masonry-ish photo flow: CSS columns (3 → 2 → 1 via container
 * query) of natural-aspect figures with optional captions. Owns its own figure
 * markup — the media Gallery's uniform interactive grid doesn't fit an
 * editorial captioned flow. */
export function GalleryB({
  images,
  eyebrow,
  heading,
  lede,
  align,
  columns: _columns,
  aspect: _aspect,
  background = 'none',
  children,
  ...props
}: GallerySectionProps) {
  return (
    <SectionShell wrap="col sx-gap-6" background={background} {...props}>
      {children ?? (
        <>
          <GalleryHead eyebrow={eyebrow} heading={heading} lede={lede} align={align} />
          <div className="sx-gal__masonry">
            {images.map((im, i) => (
              <figure key={i} className="sx-gal__fig">
                <img src={im.src} alt={im.alt} loading="lazy" />
                {im.caption && (
                  <figcaption className="muted sx-fs-caption">{im.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </>
      )}
    </SectionShell>
  );
}
