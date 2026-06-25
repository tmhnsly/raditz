'use client';
import type { HTMLAttributes, ReactNode, ReactElement } from 'react';
import { cx, Overlay, useOverlayLabels } from '../../internal';

export interface AlertDialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Open state (controlled). */
  open?: boolean;
  /** Fires to request open/close. */
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Cancel button label. @default "Cancel" */
  cancelText?: string;
  /** Confirm button label. @default "Confirm" */
  actionText?: string;
  /** Fires when the confirm action is chosen (dialog then closes). */
  onAction?: () => void;
  /** Confirm-button tone. @default "danger" */
  tone?: 'danger' | 'accent';
}

/**
 * AlertDialog — a modal confirmation (Radix AlertDialog). Like Dialog but
 * requires an explicit choice: it does NOT close on scrim click (Escape cancels).
 * `tone` colors the confirm action.
 *
 * An adapter face over {@link Overlay}: the "no outside-dismiss" behavior is one
 * honest flag (`dismissOnOutside={false}`), not a ref-targeting trick.
 */
export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = 'Cancel',
  actionText = 'Confirm',
  onAction,
  tone = 'danger',
  className,
  ...rest
}: AlertDialogProps): ReactElement | null {
  const cancel = (): void => { if (onOpenChange) onOpenChange(false); };
  const { titleId, descId, labelledby, describedby } = useOverlayLabels(title, description);
  const actionClass = tone === 'danger'
    ? 'rdz-btn rdz-btn--primary rdz-alert__danger'
    : 'rdz-btn rdz-btn--primary';
  return (
    <Overlay
      open={!!open}
      onDismiss={cancel}
      position={{ kind: 'centered' }}
      focus="trap"
      dismissOnOutside={false}
      role="alertdialog"
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      className={cx('rdz-dialog', 'rdz-dialog--sm', className)}
      {...rest}
    >
      {title || description ? (
        <div className="rdz-dialog__header">
          {title ? <h2 id={titleId} className="rdz-dialog__title">{title}</h2> : null}
          {description ? <p id={descId} className="rdz-dialog__desc">{description}</p> : null}
        </div>
      ) : null}
      <div className="rdz-dialog__footer">
        <button type="button" className="rdz-btn rdz-btn--ghost" onClick={cancel}>{cancelText}</button>
        <button type="button" className={actionClass} onClick={() => { if (onAction) onAction(); cancel(); }}>{actionText}</button>
      </div>
    </Overlay>
  );
}
