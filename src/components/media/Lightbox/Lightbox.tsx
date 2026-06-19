import * as React from 'react';
import { useControllableState, Overlay, onKeys, KEYS, cx } from '../../internal';

const { useState, useEffect, useRef, useCallback } = React;

export interface LightboxImage {
  src: string;
  /** Optional smaller image for the filmstrip / grid. */
  thumb?: string;
  alt?: string;
  caption?: React.ReactNode;
  /** Category/label chips shown bottom-left in the viewer. */
  tags?: string[];
}

export interface LightboxProps extends React.HTMLAttributes<HTMLDivElement> {
  images?: LightboxImage[];
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Active image index (controlled). */
  index?: number;
  /** Initial index (uncontrolled). @default 0 */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Show the thumbnail filmstrip. @default false */
  filmstrip?: boolean;
}

const X = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);
const CHEV = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

/**
 * Lightbox — a full-screen image viewer (gallery modal). Controlled with `open`
 * + `index`, or uncontrolled with `defaultOpen` / `defaultIndex`. Arrow keys and
 * the on-screen arrows page; swipe works on touch; clicking the image toggles
 * zoom; Escape or the scrim closes. A thumbnail filmstrip lets you jump.
 * `images` is `[{ src, thumb?, alt?, caption?, tags? }]`.
 */
export function Lightbox({
  images = [],
  open,
  defaultOpen = false,
  onOpenChange,
  index,
  defaultIndex = 0,
  onIndexChange,
  filmstrip = false,
  className,
  ...rest
}: LightboxProps): React.ReactElement | null {
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const [idx, setIdx] = useControllableState<number>({ value: index, defaultValue: defaultIndex, onChange: onIndexChange });
  const [zoom, setZoom] = useState(false);
  const count = images.length;

  const go = useCallback(
    (d: number) => {
      setZoom(false);
      setIdx((i) => (((i + d) % count) + count) % count);
    },
    [count, setIdx],
  );
  const close = useCallback(() => setOpen(false), [setOpen]);
  // Escape / scroll-lock / focus-trap / scrim sizing come from Overlay; arrows
  // (paging) stay here as a Lightbox concern.
  const onKeyDown = onKeys({ [KEYS.ArrowRight]: () => go(1), [KEYS.ArrowLeft]: () => go(-1) });

  const startX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent): void => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent): void => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (!zoom && Math.abs(dx) > 48 && count > 1) go(dx < 0 ? 1 : -1);
  };

  const cur: LightboxImage = images[idx] || { src: '' };
  return (
    <Overlay
      open={isOpen && count > 0}
      onDismiss={close}
      position={{ kind: 'centered' }}
      scrim={false}
      containerClassName="srx-overlay--lightbox"
      focus="trap"
      role="dialog"
      aria-label="Image viewer"
      className={cx('srx-lightbox', className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <div className="srx-lightbox__scrim" onClick={close} />
      <button type="button" className="srx-lightbox__close" aria-label="Close" onClick={close}>
        {X}
      </button>
      <figure className="srx-lightbox__stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <img
          className={cx('srx-lightbox__img', zoom && 'is-zoom')}
          src={cur.src}
          alt={cur.alt || ''}
          onClick={() => setZoom((z) => !z)}
          draggable="false"
        />
      </figure>
      {filmstrip && count > 1 ? (
        <div className="srx-lightbox__film">
          {images.map((im, i) => (
            <button
              key={i}
              type="button"
              className={cx('srx-lightbox__thumb', i === idx && 'is-active')}
              aria-label={`View image ${i + 1}`}
              aria-current={i === idx ? 'true' : undefined}
              onClick={() => {
                setZoom(false);
                setIdx(i);
              }}
            >
              <img src={im.thumb || im.src} alt="" draggable="false" />
            </button>
          ))}
        </div>
      ) : null}
      <div className="srx-lightbox__footer">
        <div className="srx-lightbox__meta">
          {cur.caption ? <span className="srx-lightbox__caption">{cur.caption}</span> : null}
          {cur.tags && cur.tags.length ? (
            <div className="srx-lightbox__tags">
              {cur.tags.map((t) => (
                <span key={t} className="srx-lightbox__tag">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {count > 1 ? (
          <div className="srx-lightbox__controls">
            <button type="button" className="srx-lightbox__nav" aria-label="Previous image" onClick={() => go(-1)}>
              {CHEV}
            </button>
            <span className="srx-lightbox__counter">
              {idx + 1} / {count}
            </span>
            <button type="button" className="srx-lightbox__nav srx-lightbox__nav--next" aria-label="Next image" onClick={() => go(1)}>
              {CHEV}
            </button>
          </div>
        ) : null}
      </div>
    </Overlay>
  );
}
