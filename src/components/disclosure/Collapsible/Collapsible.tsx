'use client';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { useControllableState, cx } from '../../internal';

export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Fires when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Trigger label/content. */
  trigger?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * Collapsible — a single show/hide region with a trigger (Radix Collapsible).
 * Controlled with `open`, or uncontrolled with `defaultOpen`.
 */
export function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  trigger,
  disabled = false,
  className,
  children,
  ...rest
}: CollapsibleProps): ReactElement {
  const [isOpen, setOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  return (
    <div className={cx('rdz-collapsible', className)} data-state={isOpen ? 'open' : 'closed'} {...rest}>
      <button
        type="button"
        className="rdz-collapsible__trigger"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setOpen(!isOpen)}
      >
        <span>{trigger}</span>
        <svg className="rdz-collapsible__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="rdz-collapsible__panel" hidden={!isOpen}>{children}</div>
    </div>
  );
}
