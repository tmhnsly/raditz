'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, HTMLAttributes, ReactNode, ReactElement, RefObject } from 'react';
import { cx } from './cx';
import {
  useDismiss,
  useFocusTrap,
  useScrollLock,
  useOverlayPosition,
} from './overlayHooks';
import { usePresence } from './usePresence';
import type { OverlayPosition } from './overlayHooks';

export type { OverlayPosition } from './overlayHooks';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the overlay is shown. Renders nothing when false. */
  open: boolean;
  /** Requested close — from Escape, outside-click, or scrim click. */
  onDismiss: () => void;
  /** Which topology to render and how to position it. */
  position: OverlayPosition;
  /** Show a backdrop scrim. @default true for centered/side, false otherwise */
  scrim?: boolean;
  /** Close on Escape. @default true */
  dismissOnEscape?: boolean;
  /** Close on outside interaction (scrim click / outside pointerdown). @default true */
  dismissOnOutside?: boolean;
  /** Trigger element excluded from outside detection (anchored topologies). */
  ignore?: RefObject<HTMLElement | null>;
  /** Lock body scroll while open. @default true for centered/side, false otherwise */
  scrollLock?: boolean;
  /** Focus behavior. `trap`=modal, `auto`=focus first/initialFocus, `none`=leave it. @default 'none' */
  focus?: 'trap' | 'auto' | 'none';
  /** Element to focus when `focus="auto"` (else the first focusable). */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Extra class on the fixed container (e.g. positioning modifier). */
  containerClassName?: string;
  /** Class on the panel. */
  className?: string;
  /** Extra inline style on the panel (merged after positioning). */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Overlay — the one module behind every Raditz overlay. Owns dismissal
 * (Escape / outside-click / scrim), scroll-lock, focus (trap/auto/none), the
 * scrim, and positioning for all four {@link OverlayPosition} topologies.
 *
 * It is *internal*: the public components (Dialog, Drawer, AlertDialog, Popover,
 * HoverCard, CommandPalette, …) are thin adapter faces that render an Overlay
 * with a fixed flag set plus their own trigger and presentation. Renders nothing
 * while `open` is false (no exit transition — matches the library's behavior).
 */
export function Overlay({
  open,
  onDismiss,
  position,
  scrim,
  dismissOnEscape = true,
  dismissOnOutside = true,
  ignore,
  scrollLock,
  focus = 'none',
  initialFocus,
  containerClassName,
  className,
  style,
  children,
  ...rest
}: OverlayProps): ReactElement | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const modal = position.kind === 'centered' || position.kind === 'side';
  const wantScrim = scrim ?? modal;
  const wantScrollLock = scrollLock ?? modal;
  // Stay mounted through the exit animation. Positioning tracks `mounted` (so an
  // anchored panel keeps its place while it animates out); everything else keys
  // off `open` (the intent) — scroll-lock, focus and dismissal release the
  // instant a close is requested, only the visual lingers.
  const { mounted, status } = usePresence(open, panelRef);
  const dataState = status === 'open' ? 'open' : 'closed';
  const pos = useOverlayPosition(panelRef, position, mounted);

  useScrollLock(open && wantScrollLock);
  useFocusTrap(panelRef, open && focus === 'trap');

  // For modals the scrim handles outside-dismiss; for anchored there is no
  // scrim, so useDismiss watches outside pointerdowns directly.
  useDismiss(panelRef, open && (dismissOnEscape || (!modal && dismissOnOutside)), onDismiss, {
    ignoreRef: ignore,
    escape: dismissOnEscape,
    outside: !modal && dismissOnOutside,
  });

  // focus="auto": move focus in on open, restore on close (no tab trap).
  useEffect(() => {
    if (!open || focus !== 'auto') return undefined;
    const prev = document.activeElement as HTMLElement | null;
    const target = initialFocus?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panelRef.current;
    target?.focus({ preventScroll: true });
    return () => { if (prev && prev.focus) prev.focus({ preventScroll: true }); };
  }, [open, focus, initialFocus]);

  if (!mounted) return null;

  // Anchored/point panels are positioned by --rdz-overlay-* custom properties that
  // useOverlayPosition writes IMPERATIVELY (so a scroll re-position doesn't wait on
  // a React render). The hook is the SOLE writer of those props — Overlay must not
  // also set them from `pos`, or a re-render would reassert the last-committed
  // (stale) coords over the live ones, snapping the panel back. centered/side are
  // positioned by the container. `pos` still drives data-side / data-ready below.
  const anchored = !modal;
  const panelStyle = style;

  const panel = (
    <div
      ref={panelRef}
      className={cx(anchored && 'rdz-overlay__panel', className)}
      aria-modal={focus === 'trap' ? true : undefined}
      data-side={pos.side}
      data-state={dataState}
      data-ready={anchored ? (pos.ready ? 'true' : 'false') : undefined}
      style={panelStyle}
      {...rest}
    >
      {children}
    </div>
  );

  const node = (!modal && !wantScrim)
    ? panel
    : (
      <div
        className={cx('rdz-overlay', position.kind === 'side' && 'rdz-overlay--drawer', containerClassName)}
        data-side={position.kind === 'side' ? position.side : undefined}
        data-state={dataState}
      >
        {wantScrim ? (
          <div className="rdz-overlay__scrim" onClick={dismissOnOutside ? onDismiss : undefined} />
        ) : null}
        {panel}
      </div>
    );

  // Portal to <body> so `position: fixed` is viewport-relative regardless of any
  // ancestor that establishes a containing block (transform / filter /
  // backdrop-filter / will-change) — otherwise anchored panels mis-position.
  return typeof document !== 'undefined' ? createPortal(node, document.body) : node;
}
