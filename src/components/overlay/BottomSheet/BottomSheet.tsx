'use client';
import { useCallback, useRef } from 'react';
import type {
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  ReactElement,
  ReactNode,
} from 'react';
import { cx, Overlay, OverlayClose, useOpenState, useOverlayLabels } from '../../internal';

/**
 * Drag-to-close decision: a release counts as "close" when the sheet was
 * dragged down past 25% of its own height. Pure — unit-testable without a DOM.
 * A zero/unmeasured height never closes (a phantom close on a sheet that
 * hasn't laid out yet would eat the user's content).
 */
export function shouldCloseFromDrag(draggedPx: number, sheetHeightPx: number): boolean {
  return sheetHeightPx > 0 && draggedPx > sheetHeightPx * 0.25;
}

interface DragSession {
  sheet: HTMLElement;
  startY: number;
  height: number;
  delta: number;
}

export interface BottomSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled) — the sheet then owns open/close
   *  itself (Escape, scrim, close button, drag-to-close). @default false */
  defaultOpen?: boolean;
  /** Fires to request open/close. */
  onOpenChange?: (open: boolean) => void;
  /** Heading text (title bar, like Dialog's). */
  title?: ReactNode;
  /** Sub-heading / description text. */
  description?: ReactNode;
  /** Footer node (usually action buttons). */
  footer?: ReactNode;
  /** Sheet height: `auto` sizes to content (up to 90svh); `tall` is near-full,
   *  leaving the top safe-area clear. @default "auto" */
  height?: 'auto' | 'tall';
  children?: ReactNode;
}

/**
 * BottomSheet — a mobile-first sheet fixed to the viewport bottom (full width
 * up to the container measure, top corners rounded, slides up). Controlled with
 * `open` / `onOpenChange`, or uncontrolled via `defaultOpen`; render your own
 * trigger. Closes on Escape, scrim click, the close button, or by dragging the
 * grab handle / title bar down past a quarter of its height
 * ({@link shouldCloseFromDrag}). Focus is trapped and body scroll locked while
 * open.
 *
 * An adapter face over {@link Overlay} (`side: bottom` topology, focus trap).
 * The drag offset travels as the `--rdz-sheet-drag` custom property (data, not
 * inline styling) — the stylesheet turns it into the transform.
 */
export function BottomSheet({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  footer,
  height = 'auto',
  children,
  className,
  ...rest
}: BottomSheetProps): ReactElement | null {
  const { open: isOpen, close } = useOpenState({ open, defaultOpen, onOpenChange });
  const { titleId, descId, labelledby, describedby } = useOverlayLabels(title, description);
  const dragRef = useRef<DragSession | null>(null);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    // Primary button only; and never steal the gesture from a real control in
    // the title bar (the close disc must stay clickable — pointer capture on
    // the header would retarget its click).
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    const sheet = e.currentTarget.closest<HTMLElement>('.rdz-sheet');
    if (!sheet) return;
    dragRef.current = {
      sheet,
      startY: e.clientY,
      height: sheet.getBoundingClientRect().height,
      delta: 0,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    sheet.setAttribute('data-dragging', 'true');
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    // Downward travel only — the sheet is already at its rest position.
    drag.delta = Math.max(0, e.clientY - drag.startY);
    drag.sheet.style.setProperty('--rdz-sheet-drag', `${drag.delta}px`);
  }, []);

  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    // Clearing the attribute re-enables the settle transition; clearing the
    // property lets the sheet glide back to rest (or it unmounts on close).
    drag.sheet.removeAttribute('data-dragging');
    drag.sheet.style.removeProperty('--rdz-sheet-drag');
    if (shouldCloseFromDrag(drag.delta, drag.height)) close();
  }, [close]);

  const dragHandlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  } as const;

  return (
    <Overlay
      open={isOpen}
      onDismiss={close}
      position={{ kind: 'side', side: 'bottom' }}
      focus="trap"
      role="dialog"
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      className={cx('rdz-sheet', className)}
      data-height={height}
      {...rest}
    >
      <div className="rdz-sheet__grab" aria-hidden="true" {...dragHandlers} />
      {title || description ? (
        <div className="rdz-sheet__header" {...dragHandlers}>
          <div className="rdz-sheet__heading">
            {title ? <h2 id={titleId} className="rdz-sheet__title">{title}</h2> : null}
            {description ? <p id={descId} className="rdz-sheet__desc">{description}</p> : null}
          </div>
          <OverlayClose className="rdz-sheet__close" onClick={close} />
        </div>
      ) : (
        <OverlayClose className="rdz-sheet__close rdz-sheet__close--solo" onClick={close} />
      )}
      <div className="rdz-sheet__body rdz-scrollbar">{children}</div>
      {footer ? <div className="rdz-sheet__footer">{footer}</div> : null}
    </Overlay>
  );
}
