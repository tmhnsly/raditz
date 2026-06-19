import { useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, ReactElement } from 'react';
import { cx, Overlay } from '../../internal';

export interface HoverCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Element that reveals the card on hover/focus. */
  trigger?: ReactNode;
  /** Preferred side. @default "bottom" */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Cross-axis alignment. @default "center" */
  align?: 'start' | 'center' | 'end';
  /** Ms before opening. @default 200 */
  openDelay?: number;
  /** Ms before closing. @default 150 */
  closeDelay?: number;
  children?: ReactNode;
}

/**
 * HoverCard — preview content shown on hover/focus of a trigger (Radix
 * HoverCard). Opens after `openDelay`, closes after `closeDelay`; staying over
 * the card keeps it open.
 *
 * An adapter face over {@link Overlay} (`anchored` topology). HoverCard drives
 * its own open state via hover timers, so it disables Overlay's dismissal.
 */
export function HoverCard({
  trigger,
  children,
  side = 'bottom',
  align = 'center',
  openDelay = 200,
  closeDelay = 150,
  className,
  ...rest
}: HoverCardProps): ReactElement {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (): void => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), openDelay); };
  const hide = (): void => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), closeDelay); };
  return (
    <span className="srx-hovercard__root" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <span ref={anchorRef} className="srx-hovercard__anchor">{trigger}</span>
      <Overlay
        open={open}
        onDismiss={() => setOpen(false)}
        position={{ kind: 'anchored', anchor: anchorRef, side, align }}
        focus="none"
        dismissOnEscape={false}
        dismissOnOutside={false}
        className={cx('srx-hovercard', className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        {...rest}
      >
        {children}
      </Overlay>
    </span>
  );
}
