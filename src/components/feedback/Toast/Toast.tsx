import * as React from 'react';
import { cx } from '../../internal';

const { useState, useEffect } = React;

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  /** Optional action button. */
  action?: { label: React.ReactNode; onClick?: () => void };
  /** Auto-dismiss ms (Infinity to persist). Defaults to the viewport's duration. */
  duration?: number;
}

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Where toasts stack. @default "bottom-right" */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'top-center';
  /** Default auto-dismiss ms. @default 4000 */
  duration?: number;
}

export interface ToastComponent {
  (props: ToastProps): React.ReactElement;
  /** Fire a toast from anywhere. */
  show: (opts: ToastOptions | string) => void;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

type Listener = (opts: ToastOptions | string) => void;

// Module-level event bus so any code can fire a toast via Toast.show(...).
let listeners: Listener[] = [];
let counter = 0;
function emit(t: ToastOptions | string): void {
  listeners.forEach((l) => l(t));
}

/**
 * Toast — transient notifications (Radix Toast). Mount ONE `<Toast />` near the
 * root, then call `Toast.show({ title, description?, variant?, action?, duration? })`
 * (or `Toast.show('Saved')`) from anywhere. `variant`: 'default' | 'success' |
 * 'warning' | 'danger'.
 */
export const Toast: ToastComponent = function Toast({
  position = 'bottom-right',
  duration = 4000,
  ...rest
}: ToastProps): React.ReactElement {
  const [items, setItems] = useState<ToastEntry[]>([]);
  useEffect(() => {
    const onAdd: Listener = (opts) => {
      const id = (counter += 1);
      const entry: ToastOptions = typeof opts === 'string' ? { title: opts } : opts || {};
      setItems((prev) => [...prev, { id, ...entry }]);
      const dur = entry.duration == null ? duration : entry.duration;
      if (dur !== Infinity && dur > 0) {
        setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), dur);
      }
    };
    listeners.push(onAdd);
    return () => {
      listeners = listeners.filter((l) => l !== onAdd);
    };
  }, [duration]);

  const dismiss = (id: number): void => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className={`srx-toast-viewport srx-toast-viewport--${position}`} {...rest}>
      {items.map((it) => (
        <div
          key={it.id}
          className={cx('srx-toast', it.variant && it.variant !== 'default' && `srx-toast--${it.variant}`)}
          role="status"
          aria-live="polite"
        >
          <div className="srx-toast__body">
            {it.title ? <div className="srx-toast__title">{it.title}</div> : null}
            {it.description ? <div className="srx-toast__desc">{it.description}</div> : null}
          </div>
          {it.action ? (
            <button
              type="button"
              className="srx-toast__action"
              onClick={() => {
                if (it.action?.onClick) it.action.onClick();
                dismiss(it.id);
              }}
            >
              {it.action.label}
            </button>
          ) : null}
          <button type="button" className="srx-toast__close" aria-label="Dismiss" onClick={() => dismiss(it.id)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
} as ToastComponent;

/** Fire a toast from anywhere. */
Toast.show = (opts: ToastOptions | string): void => emit(opts);
