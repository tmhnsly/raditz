import { useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cx, Overlay } from '../../internal';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Bubble content. */
  label: ReactNode;
  /** Side of the trigger the bubble opens on; flips to the opposite side on
   *  overflow. @default "top" */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Cross-axis alignment of the bubble vs. the trigger. @default "center" */
  align?: 'center' | 'start' | 'end';
  /** Open delay on hover/focus (ms). @default 200 */
  delay?: number;
  children?: ReactNode;
}

/**
 * A hover/focus tooltip. Wraps a focusable trigger; `label` is the bubble.
 *
 * The bubble renders through the shared {@link Overlay} machinery — portaled to
 * <body> and collision-positioned (flips + clamps to the viewport), so it never
 * runs off-screen the way the old pure-CSS bubble did. The trigger must be
 * focusable (a button/link) so keyboard users get the tooltip too.
 */
export function Tooltip({ label, side = 'top', align = 'center', delay = 200, className, children, ...rest }: TooltipProps): ReactElement {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const tipId = useId();

  const show = (): void => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = (): void => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  };
  // Clear a pending open-delay timer if the trigger unmounts mid-hover.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <span
      ref={anchorRef}
      className={cx('srx-tooltip', className)}
      aria-describedby={open ? tipId : undefined}
      {...rest}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {children}
      <Overlay
        open={open}
        onDismiss={hide}
        position={{ kind: 'anchored', anchor: anchorRef, side, align, gap: 8 }}
        scrim={false}
        dismissOnOutside={false}
        className="srx-tooltip__bubble"
        id={tipId}
        role="tooltip"
      >
        {label}
      </Overlay>
    </span>
  );
}
