import * as React from 'react';
import { useControllableState, cx, rovingIndex } from '../../internal';

export interface ToggleGroupItem {
  value: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Single-select (radio-like) or multi-select. @default "single" */
  type?: 'single' | 'multiple';
  /** Controlled value — string for single, string[] for multiple. */
  value?: string | string[];
  /** Initial value (uncontrolled). */
  defaultValue?: string | string[];
  /** Fires when selection changes. */
  onValueChange?: (value: string | string[]) => void;
  /** Buttons to render. */
  items?: ToggleGroupItem[];
  /** Control size. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

/**
 * ToggleGroup — a segmented set of toggle buttons (Radix ToggleGroup).
 * `type="single"` behaves like a radio set; `type="multiple"` lets any number
 * stay pressed. Items are `{ value, label?, icon?, disabled? }`.
 */
export function ToggleGroup({
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  items = [],
  disabled = false,
  size = 'md',
  className,
  ...rest
}: ToggleGroupProps): React.ReactElement {
  const [val, setVal] = useControllableState<string | string[]>({
    value,
    defaultValue: defaultValue ?? (type === 'multiple' ? [] : ''),
    onChange: onValueChange,
  });
  const isOn = (v: string): boolean => (type === 'multiple' ? ((val as string[]) || []).includes(v) : val === v);
  const toggle = (v: string): void => {
    if (type === 'multiple') {
      const arr = (val as string[]) || [];
      setVal(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      setVal(val === v ? '' : v);
    }
  };
  const cls = cx('rdz-toggle-group', size !== 'md' && `rdz-toggle-group--${size}`, className);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  // Single-select acts as a radiogroup: arrow keys rove focus + selection.
  const singleIdx = type === 'single' ? items.findIndex((it) => it.value === val) : -1;
  const focusIdx = singleIdx < 0 ? 0 : singleIdx;
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (type !== 'single') return;
    const next = rovingIndex(e.key, focusIdx, items.length, { orientation: 'horizontal', loop: true });
    if (next === null) return;
    e.preventDefault();
    const it = items[next];
    if (it && !it.disabled && !disabled) { setVal(it.value); itemRefs.current[next]?.focus(); }
  };
  return (
    <div className={cls} role={type === 'single' ? 'radiogroup' : 'group'} onKeyDown={onKeyDown} {...rest}>
      {items.map((it, i) => {
        const on = isOn(it.value);
        return (
          <button
            type="button"
            key={it.value}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="rdz-toggle-group__item"
            data-state={on ? 'on' : 'off'}
            role={type === 'single' ? 'radio' : undefined}
            aria-checked={type === 'single' ? on : undefined}
            aria-pressed={type === 'multiple' ? on : undefined}
            aria-label={it.label ? undefined : it.value}
            title={typeof it.label === 'string' ? it.label : it.value}
            tabIndex={type === 'single' ? (i === focusIdx ? 0 : -1) : undefined}
            disabled={disabled || it.disabled}
            onClick={() => toggle(it.value)}
          >
            {it.icon}
            {it.label ? <span>{it.label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
