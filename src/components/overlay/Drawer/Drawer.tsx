'use client';
import type { CSSProperties, HTMLAttributes, ReactNode, ReactElement } from 'react';
import { cx, Overlay, OverlayClose, useOverlayLabels } from '../../internal';

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Open state (controlled). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Edge it slides from. @default "right" */
  side?: 'left' | 'right' | 'top' | 'bottom';
  /** Width (left/right) or height (top/bottom). @default "22rem" */
  size?: string;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * Drawer — a panel that slides in from an edge (Radix-style sheet). Controlled
 * with `open` / `onOpenChange`. `side` picks the edge; `size` sets width (left/
 * right) or height (top/bottom). Closes on Escape, scrim click or the close
 * button; focus is trapped and body scroll locked while open.
 *
 * An adapter face over {@link Overlay} (`side` topology, focus trap).
 */
export function Drawer({
  open,
  onOpenChange,
  side = 'right',
  size = '22rem',
  title,
  description,
  footer,
  children,
  className,
  ...rest
}: DrawerProps): ReactElement | null {
  const close = (): void => { if (onOpenChange) onOpenChange(false); };
  const { titleId, descId, labelledby, describedby } = useOverlayLabels(title, description);
  // Dynamic size flows through a CSS custom property (data, not inline styling);
  // the side class decides whether it drives width or height.
  const style = { '--rdz-drawer-size': size } as CSSProperties;
  return (
    <Overlay
      open={!!open}
      onDismiss={close}
      position={{ kind: 'side', side }}
      focus="trap"
      role="dialog"
      aria-labelledby={labelledby}
      aria-describedby={describedby}
      className={cx('rdz-drawer', `rdz-drawer--${side}`, className)}
      style={style}
      {...rest}
    >
      {title || description ? (
        <div className="rdz-drawer__header">
          <div>
            {title ? <h2 id={titleId} className="rdz-drawer__title">{title}</h2> : null}
            {description ? <p id={descId} className="rdz-drawer__desc">{description}</p> : null}
          </div>
          <OverlayClose className="rdz-drawer__close" onClick={close} />
        </div>
      ) : null}
      <div className="rdz-drawer__body rdz-scrollbar">{children}</div>
      {footer ? <div className="rdz-drawer__footer">{footer}</div> : null}
    </Overlay>
  );
}
