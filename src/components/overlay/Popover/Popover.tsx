import type { HTMLAttributes, ReactNode, ReactElement } from 'react';
import { cx, Overlay, useTrigger } from '../../internal';

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger element (click toggles the popover). */
  trigger?: ReactNode;
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Preferred side. @default "bottom" */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Cross-axis alignment. @default "center" */
  align?: 'start' | 'center' | 'end';
  children?: ReactNode;
}

/**
 * Popover — floating content anchored to a trigger (Radix Popover). Click the
 * trigger to toggle; closes on Escape or outside click. Non-modal (focus is not
 * trapped). `side`/`align` place the panel and flip near the viewport edge.
 *
 * An adapter face over {@link Overlay} (`anchored` topology, focus `none`). The
 * trigger and its click-to-toggle stay here; Overlay owns the surface.
 */
export function Popover({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'center',
  className,
  ...rest
}: PopoverProps): ReactElement {
  const { open, toggle, close, anchorRef } = useTrigger<HTMLSpanElement>({ open: openProp, defaultOpen, onOpenChange });
  return (
    <span className="srx-popover__root">
      <span ref={anchorRef} className="srx-popover__anchor" onClick={toggle}>{trigger}</span>
      <Overlay
        open={open}
        onDismiss={close}
        position={{ kind: 'anchored', anchor: anchorRef, side, align }}
        ignore={anchorRef}
        focus="none"
        role="dialog"
        className={cx('srx-popover', className)}
        {...rest}
      >
        {children}
      </Overlay>
    </span>
  );
}
