import type { HTMLAttributes, ReactNode, ReactElement } from 'react';
import { cx, Overlay, OverlayClose } from '../../internal';

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Open state (controlled). */
  open?: boolean;
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
 * `onOpenChange`; render your own trigger. Closes on Escape, scrim click, or
 * the close button. Focus is trapped while open and restored on close.
 *
 * An adapter face over {@link Overlay} (`centered` topology, focus trap).
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
  ...rest
}: DialogProps): ReactElement | null {
  const close = (): void => { if (onOpenChange) onOpenChange(false); };
  return (
    <Overlay
      open={!!open}
      onDismiss={close}
      position={{ kind: 'centered' }}
      focus="trap"
      role="dialog"
      aria-label={typeof title === 'string' ? title : undefined}
      className={cx('rdz-dialog', `rdz-dialog--${size}`, className)}
      {...rest}
    >
      {title || description ? (
        <div className="rdz-dialog__header">
          {title ? <h2 className="rdz-dialog__title">{title}</h2> : null}
          {description ? <p className="rdz-dialog__desc">{description}</p> : null}
        </div>
      ) : null}
      {children ? <div className="rdz-dialog__body">{children}</div> : null}
      {footer ? <div className="rdz-dialog__footer">{footer}</div> : null}
      <OverlayClose className="rdz-dialog__close" onClick={close} />
    </Overlay>
  );
}
