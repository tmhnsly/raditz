'use client';
import type { HTMLAttributes, ReactNode, ReactElement } from 'react';
import { cx, Overlay, OverlayClose, useOpenState, useOverlayLabels } from '../../internal';

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled) — the dialog then owns open/close
   *  itself (Escape, scrim, close button). @default false */
  defaultOpen?: boolean;
  /** Fires to request open/close. */
  onOpenChange?: (open: boolean) => void;
  /** Heading text. */
  title?: ReactNode;
  /** Sub-heading / description text. */
  description?: ReactNode;
  /** Footer node (usually action buttons). */
  footer?: ReactNode;
  /** Panel width. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

/**
 * Dialog — a modal overlay (Radix Dialog). Controlled with `open` /
 * `onOpenChange`, or uncontrolled via `defaultOpen`; render your own trigger.
 * Closes on Escape, scrim click, or the close button. Focus is trapped while
 * open and restored on close.
 *
 * An adapter face over {@link Overlay} (`centered` topology, focus trap).
 */
export function Dialog({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
  ...rest
}: DialogProps): ReactElement | null {
  const { open: isOpen, close } = useOpenState({ open, defaultOpen, onOpenChange });
  const { titleId, descId, labelledby, describedby } = useOverlayLabels(title, description);
  return (
    <Overlay
      open={isOpen}
      onDismiss={close}
      position={{ kind: 'centered' }}
      focus="trap"
      role="dialog"
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      className={cx('rdz-dialog', className)}
      data-size={size}
      {...rest}
    >
      {title || description ? (
        <div className="rdz-dialog__header">
          <div className="rdz-dialog__heading">
            {title ? <h2 id={titleId} className="rdz-dialog__title">{title}</h2> : null}
            {description ? <p id={descId} className="rdz-dialog__desc">{description}</p> : null}
          </div>
          <OverlayClose className="rdz-dialog__close" onClick={close} />
        </div>
      ) : (
        <OverlayClose className="rdz-dialog__close rdz-dialog__close--solo" onClick={close} />
      )}
      {children ? <div className="rdz-dialog__body rdz-scrollbar">{children}</div> : null}
      {footer ? <div className="rdz-dialog__footer">{footer}</div> : null}
    </Overlay>
  );
}
