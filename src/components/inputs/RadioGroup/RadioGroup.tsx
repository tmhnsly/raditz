'use client';
import * as React from 'react';
import { useControllableState, useStableId, cx } from '../../internal';

export interface RadioGroupItem {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value (uncontrolled). */
  defaultValue?: string;
  /** Fires when the selection changes. */
  onValueChange?: (value: string) => void;
  /** Shared input name (auto-generated if omitted). */
  name?: string;
  /** Options to render. */
  items?: RadioGroupItem[];
  /** Layout direction. @default "vertical" */
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
}

/**
 * RadioGroup — a set of mutually-exclusive radios (Radix RadioGroup). Items are
 * `{ value, label, description?, disabled? }`. Controlled with `value`,
 * uncontrolled with `defaultValue`.
 */
export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  name,
  items = [],
  disabled = false,
  orientation = 'vertical',
  className,
  ...rest
}: RadioGroupProps): React.ReactElement {
  const [val, setVal] = useControllableState<string | undefined>({ value, defaultValue, onChange: onValueChange as ((value: string | undefined) => void) | undefined });
  const auto = useStableId('radiogroup');
  const groupName = name || auto;
  const cls = cx('rdz-radio-group', `rdz-radio-group--${orientation}`, className);
  return (
    <div className={cls} role="radiogroup" {...rest}>
      {items.map((it) => {
        const id = `${groupName}-${it.value}`;
        const checked = val === it.value;
        const isDisabled = disabled || it.disabled;
        return (
          <label className="rdz-radio-group__item" key={it.value} htmlFor={id} data-disabled={isDisabled || undefined}>
            <span className="rdz-radio-ctl">
              <input
                type="radio"
                id={id}
                name={groupName}
                value={it.value}
                checked={checked}
                disabled={isDisabled}
                onChange={() => setVal(it.value)}
              />
              <span className="rdz-radio-ctl__box" />
            </span>
            <span className="rdz-radio-group__text">
              <span className="rdz-radio-group__title">{it.label}</span>
              {it.description ? <span className="rdz-radio-group__desc">{it.description}</span> : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
