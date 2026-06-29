'use client';
import * as React from 'react';
import { useControllableState, Overlay, onKeys, KEYS, cx, OverlayClose } from '../../internal';
import {
  MAX_SCALE, dist, pinch, clampPan, zoomScale, resolveDrag, swipePage, dismissShouldClose, dismissView,
} from './gestures';

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

type GestureMode = 'pending' | 'pan' | 'swipe' | 'dismiss' | 'pinch';
interface Gesture {
  mode: GestureMode;
  startX: number;
  startY: number;
  panX: number;
  panY: number;
  startScale: number;
  startDist: number;
  cx: number;
  cy: number;
}

/**
 * Lightbox — a full-screen image viewer (gallery modal). Controlled with `open`
 * + `index`, or uncontrolled with `defaultOpen` / `defaultIndex`. Arrow keys and
 * the on-screen arrows page; the image follows your finger and slides on swipe.
 * Zoom with a pinch (trackpad or touch), the +/− buttons, or a click; drag to
 * pan when zoomed. Swipe down (or click the black space, or Escape) to close.
 *
 * Pan/zoom/swipe are driven imperatively (the transform is written straight to
 * the image, not through React state) so a drag stays at the display's frame
 * rate instead of thrashing a render per pointer move. The chrome always renders
 * on a dark scrim (identical in light + dark themes) via `.rdz-on-dark`.
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
  const count = images.length;

  const stageRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gesture = useRef<Gesture | null>(null);
  const moved = useRef(false);
  const dirRef = useRef<1 | -1>(1);
  // Live transform mirror + synchronous scale, so a burst of wheel/pinch events
  // accumulates from the latest value instead of a stale render closure.
  const live = useRef({ x: 0, y: 0, scale: 1 });
  const scaleRef = useRef(1);

  // Write the transform straight to the image (custom properties) — `animate`
  // toggles the CSS transition off (live drag) or on (zoom/snap). Bypasses React
  // so a pointer move never waits on a render.
  const applyView = useCallback((x: number, y: number, s: number, animate: boolean): void => {
    live.current = { x, y, scale: s };
    const img = imgRef.current;
    if (!img) return;
    img.classList.toggle('is-live', !animate);
    img.style.setProperty('--rdz-lb-x', `${x}px`);
    img.style.setProperty('--rdz-lb-y', `${y}px`);
    img.style.setProperty('--rdz-lb-scale', String(s));
  }, []);

  const setScrim = (o: number | null): void => {
    const s = scrimRef.current;
    if (!s) return;
    if (o == null) s.style.removeProperty('opacity');
    else s.style.opacity = String(o);
  };

  const resetView = useCallback((): void => {
    scaleRef.current = 1;
    setScale(1);
    applyView(0, 0, 1, false);
    setScrim(null);
  }, [applyView]);

  // Reset zoom/pan when the viewer opens and whenever the image changes.
  useEffect(() => { if (isOpen) resetView(); }, [isOpen, resetView]);
  useEffect(() => { resetView(); }, [idx, resetView]);

  const go = useCallback(
    (d: number) => { dirRef.current = d < 0 ? -1 : 1; setIdx((i) => (((i + d) % count) + count) % count); },
    [count, setIdx],
  );
  const jumpTo = useCallback((i: number) => { dirRef.current = i < idx ? -1 : 1; setIdx(i); }, [setIdx, idx]);
  const close = useCallback(() => setOpen(false), [setOpen]);

  // Clamp a pan offset so the (target-scale) image can't be dragged off the stage.
  const clampPanFor = useCallback((x: number, y: number, s: number): { x: number; y: number } => {
    const img = imgRef.current;
    const stage = stageRef.current;
    if (!img || !stage) return { x, y };
    const ir = img.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const domScale = live.current.scale || 1;
    return clampPan(x, y, {
      projW: (ir.width / domScale) * s,
      projH: (ir.height / domScale) * s,
      stageW: sr.width,
      stageH: sr.height,
    });
  }, []);

  const zoomTo = useCallback((s: number): void => {
    const ns = zoomScale(s);
    scaleRef.current = ns;
    setScale(ns);
    if (ns === 1) applyView(0, 0, 1, true);
    else { const cp = clampPanFor(live.current.x, live.current.y, ns); applyView(cp.x, cp.y, ns, true); }
  }, [applyView, clampPanFor]);

  // Wheel zoom = PINCH ONLY. A trackpad pinch (and ctrl+wheel) arrives with
  // ctrlKey set; we zoom the image and preventDefault so the browser doesn't
  // page-zoom. A plain two-finger scroll is left alone, so it never "goes weird"
  // hijacking into a zoom. Native (non-passive) listener — React's onWheel is
  // passive, so preventDefault there is a no-op.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !isOpen) return undefined;
    const onWheelNative = (e: WheelEvent): void => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      zoomTo(scaleRef.current - e.deltaY * 0.01);
    };
    stage.addEventListener('wheel', onWheelNative, { passive: false });
    return () => stage.removeEventListener('wheel', onWheelNative);
  }, [isOpen, zoomTo]);

  // Escape / scroll-lock / focus-trap come from Overlay; paging + zoom are here.
  const onKeyDown = onKeys({ [KEYS.ArrowRight]: () => go(1), [KEYS.ArrowLeft]: () => go(-1) });

  const beginFromPointer = (id: number): void => {
    const p = pointers.current.get(id);
    if (!p) { gesture.current = null; return; }
    gesture.current = {
      mode: scaleRef.current > 1 ? 'pan' : 'pending',
      startX: p.x, startY: p.y, panX: live.current.x, panY: live.current.y,
      startScale: scaleRef.current, startDist: 0, cx: p.x, cy: p.y,
    };
  };

  const onPointerDown = (e: React.PointerEvent): void => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = false;
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      const [a, b] = pts;
      gesture.current = {
        mode: 'pinch', startX: 0, startY: 0, panX: live.current.x, panY: live.current.y,
        startScale: scaleRef.current, startDist: dist(a, b), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2,
      };
    } else if (pts.length === 1) {
      beginFromPointer(e.pointerId);
    }
  };

  const onPointerMove = (e: React.PointerEvent): void => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    const pts = [...pointers.current.values()];

    if (g.mode === 'pinch' && pts.length >= 2) {
      const [a, b] = pts;
      const next = pinch(g, a, b);
      const cp = clampPanFor(next.x, next.y, next.scale);
      moved.current = true;
      scaleRef.current = next.scale;
      applyView(cp.x, cp.y, next.scale, false);
      return;
    }
    if (g.mode === 'pan') {
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
      const cp = clampPanFor(g.panX + dx, g.panY + dy, scaleRef.current);
      applyView(cp.x, cp.y, scaleRef.current, false);
      return;
    }
    if (g.mode === 'pending') {
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      if (Math.abs(dx) + Math.abs(dy) < 6) return;
      moved.current = true;
      g.mode = resolveDrag(dx, dy);
    }
    if (g.mode === 'swipe') {
      applyView(e.clientX - g.startX, 0, 1, false); // image follows the finger
      return;
    }
    if (g.mode === 'dismiss') {
      const view = dismissView(e.clientX - g.startX, e.clientY - g.startY);
      applyView(view.x, view.y, 1, false);
      setScrim(view.scrim);
    }
  };

  const endGesture = (e: React.PointerEvent): void => {
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (!g) return;

    if (g.mode === 'pinch') {
      const s = live.current.scale;
      scaleRef.current = s;
      setScale(s);
      if (s === 1) applyView(0, 0, 1, true);
      // Hand off to a single-pointer pan if one finger remains, else end.
      const rest = [...pointers.current.keys()];
      if (rest.length >= 1) beginFromPointer(rest[0]);
      else gesture.current = null;
      return;
    }
    gesture.current = null;
    if (g.mode === 'pan') return; // committed live; nothing to animate
    if (g.mode === 'swipe') {
      const page = swipePage(e.clientX - g.startX, count);
      if (page) go(page); // remount slides the new image in
      else applyView(0, 0, 1, true); // snap back
      return;
    }
    if (g.mode === 'dismiss') {
      if (dismissShouldClose(e.clientY - g.startY)) { close(); return; }
      applyView(0, 0, 1, true);
      setScrim(null);
    }
  };

  const onImgClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (moved.current) { moved.current = false; return; }
    zoomTo(scaleRef.current > 1 ? 1 : 2);
  };
  // Click on the black space (the stage itself, not the image) closes — but not
  // after a drag/swipe, and not while zoomed (you're exploring then).
  const onStageClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget && !moved.current && scaleRef.current === 1) close();
    moved.current = false;
  };

  const cur: LightboxImage = images[idx] || { src: '' };
  return (
    <Overlay
      open={isOpen && count > 0}
      onDismiss={close}
      position={{ kind: 'centered' }}
      scrim={false}
      containerClassName="rdz-overlay--lightbox"
      focus="trap"
      role="dialog"
      aria-label="Image viewer"
      className={cx('rdz-lightbox', 'rdz-on-dark', className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      <div ref={scrimRef} className="rdz-lightbox__scrim" onClick={close} />
      <OverlayClose large className="rdz-lightbox__close" onClick={close} />
      <figure
        ref={stageRef}
        className="rdz-lightbox__stage"
        onClick={onStageClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
      >
        <img
          key={idx}
          ref={imgRef}
          className={cx('rdz-lightbox__img', scale > 1 && 'is-zoom', dirRef.current === -1 ? 'rdz-lightbox__img--in-left' : 'rdz-lightbox__img--in-right')}
          src={cur.src}
          alt={cur.alt || ''}
          onClick={onImgClick}
          draggable="false"
        />
      </figure>
      {filmstrip && count > 1 ? (
        <div className="rdz-lightbox__film">
          {images.map((im, i) => (
            <button
              key={i}
              type="button"
              className={cx('rdz-lightbox__thumb', i === idx && 'is-active')}
              aria-label={`View image ${i + 1}`}
              aria-current={i === idx ? 'true' : undefined}
              onClick={() => jumpTo(i)}
            >
              <img src={im.thumb || im.src} alt="" draggable="false" />
            </button>
          ))}
        </div>
      ) : null}
      <div className="rdz-lightbox__footer">
        <div className="rdz-lightbox__meta">
          {cur.caption ? <span className="rdz-lightbox__caption">{cur.caption}</span> : null}
          {cur.tags && cur.tags.length ? (
            <div className="rdz-lightbox__tags">
              {cur.tags.map((t) => (
                <span key={t} className="rdz-lightbox__tag">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="rdz-lightbox__controls">
          <button type="button" className="rdz-ovbtn rdz-ovbtn--lg" aria-label="Reset zoom" onClick={() => zoomTo(1)} disabled={scale <= 1}>
            {ZOOM_OUT}
          </button>
          <button type="button" className="rdz-ovbtn rdz-ovbtn--lg" aria-label="Zoom in" onClick={() => zoomTo(scaleRef.current + 0.5)} disabled={scale >= MAX_SCALE}>
            {ZOOM_IN}
          </button>
          {count > 1 ? (
            <>
              <button type="button" className="rdz-ovbtn rdz-ovbtn--lg" aria-label="Previous image" onClick={() => go(-1)}>
                {CHEV}
              </button>
              <span className="rdz-lightbox__counter">
                {idx + 1} / {count}
              </span>
              <button type="button" className="rdz-ovbtn rdz-ovbtn--lg rdz-lightbox__nav--next" aria-label="Next image" onClick={() => go(1)}>
                {CHEV}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </Overlay>
  );
}
