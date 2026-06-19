import * as React from 'react';
import { useControllableState, Overlay, onKeys, KEYS, cx, OverlayClose } from '../../internal';

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

const CHEV = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ZOOM_IN = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);
const ZOOM_OUT = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const MAX_SCALE = 4;
const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/**
 * Lightbox — a full-screen image viewer (gallery modal). Controlled with `open`
 * + `index`, or uncontrolled with `defaultOpen` / `defaultIndex`. Arrow keys and
 * the on-screen arrows page; swipe pages on touch. Zoom with the wheel, the
 * +/− buttons or a click; drag to pan when zoomed. Escape — or a click on the
 * black space around the image — closes. The chrome is always rendered on a dark
 * scrim (identical in light + dark themes) via `.srx-on-dark`.
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
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const count = images.length;

  const stageRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  const resetView = useCallback(() => { setScale(1); setPan({ x: 0, y: 0 }); }, []);
  // Reset zoom/pan whenever the viewer opens.
  useEffect(() => { if (isOpen) resetView(); }, [isOpen, resetView]);

  const go = useCallback(
    (d: number) => { resetView(); setIdx((i) => (((i + d) % count) + count) % count); },
    [count, setIdx, resetView],
  );
  const jumpTo = useCallback((i: number) => { resetView(); setIdx(i); }, [setIdx, resetView]);
  const close = useCallback(() => setOpen(false), [setOpen]);

  // Keep the (scaled) image roughly within the stage so it can't be dragged away.
  const clampPan = useCallback((x: number, y: number): { x: number; y: number } => {
    const img = imgRef.current;
    const stage = stageRef.current;
    if (!img || !stage) return { x, y };
    const ir = img.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const mx = Math.max(0, (ir.width - sr.width) / 2 + 24);
    const my = Math.max(0, (ir.height - sr.height) / 2 + 24);
    return { x: clamp(x, -mx, mx), y: clamp(y, -my, my) };
  }, []);

  const zoomTo = useCallback((s: number) => {
    const ns = clamp(s, 1, MAX_SCALE);
    setScale(ns);
    if (ns === 1) setPan({ x: 0, y: 0 });
    else setPan((p) => clampPan(p.x, p.y));
  }, [clampPan]);

  // Escape / scroll-lock / focus-trap come from Overlay; paging + zoom are here.
  const onKeyDown = onKeys({ [KEYS.ArrowRight]: () => go(1), [KEYS.ArrowLeft]: () => go(-1) });

  const onPointerDown = (e: React.PointerEvent): void => {
    moved.current = false;
    if (scale > 1) {
      drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
      setPanning(true);
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } else {
      startX.current = e.clientX;
    }
  };
  const onPointerMove = (e: React.PointerEvent): void => {
    if (drag.current) {
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
      setPan(clampPan(drag.current.px + dx, drag.current.py + dy));
    } else if (startX.current != null && Math.abs(e.clientX - startX.current) > 6) {
      moved.current = true;
    }
  };
  const onPointerUp = (e: React.PointerEvent): void => {
    if (drag.current) { drag.current = null; setPanning(false); return; }
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 48 && count > 1) go(dx < 0 ? 1 : -1);
  };
  const onWheel = (e: React.WheelEvent): void => { zoomTo(scale - e.deltaY * 0.0016); };
  const onImgClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (moved.current) { moved.current = false; return; }
    zoomTo(scale > 1 ? 1 : 2);
  };
  // Click on the black space (the stage itself, not the image) closes — but not
  // after a drag/swipe, and not while zoomed (you're exploring then).
  const onStageClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget && !moved.current && scale === 1) close();
    moved.current = false;
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
      className={cx('srx-lightbox', 'srx-on-dark', className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <div className="srx-lightbox__scrim" onClick={close} />
      <OverlayClose large className="srx-lightbox__close" onClick={close} />
      <figure
        ref={stageRef}
        className="srx-lightbox__stage"
        onClick={onStageClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <img
          ref={imgRef}
          className={cx('srx-lightbox__img', scale > 1 && 'is-zoom', panning && 'is-panning')}
          style={{ '--srx-lb-scale': scale, '--srx-lb-x': `${pan.x}px`, '--srx-lb-y': `${pan.y}px` } as React.CSSProperties}
          src={cur.src}
          alt={cur.alt || ''}
          onClick={onImgClick}
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
              onClick={() => jumpTo(i)}
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
        <div className="srx-lightbox__controls">
          <button type="button" className="srx-ovbtn" aria-label="Zoom out" onClick={() => zoomTo(scale - 0.5)} disabled={scale <= 1}>
            {ZOOM_OUT}
          </button>
          <button type="button" className="srx-ovbtn" aria-label="Zoom in" onClick={() => zoomTo(scale + 0.5)} disabled={scale >= MAX_SCALE}>
            {ZOOM_IN}
          </button>
          {count > 1 ? (
            <>
              <button type="button" className="srx-ovbtn" aria-label="Previous image" onClick={() => go(-1)}>
                {CHEV}
              </button>
              <span className="srx-lightbox__counter">
                {idx + 1} / {count}
              </span>
              <button type="button" className="srx-ovbtn srx-lightbox__nav--next" aria-label="Next image" onClick={() => go(1)}>
                {CHEV}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </Overlay>
  );
}
