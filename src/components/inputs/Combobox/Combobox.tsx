'use client';
import { useRef, useState } from 'react';
import type { HTMLAttributes, ReactElement } from 'react';
import { cx, useControllableState, Overlay, useSearchableList } from '../../internal';
import { Icon } from '../../display/Icon/Icon';
import { Search } from '../Search/Search';

export interface ComboboxOption { value: string; label: string; }
export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Selectable options — `{ value, label }` objects or plain strings. @default [] */
  options?: Array<ComboboxOption | string>;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value (uncontrolled). @default "" */
  defaultValue?: string;
  /** Fires with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Trigger text when nothing is selected. @default "Select…" */
  placeholder?: string;
  /** Message shown when the filter matches nothing. @default "No results" */
  emptyText?: string;
  /** Disable the trigger. @default false */
  disabled?: boolean;
}

/**
 * Combobox — a searchable single-select. `options` is `[{ value, label }]` (or
 * plain strings). Controlled with `value` / `onValueChange`, or uncontrolled
 * with `defaultValue`. Type to filter; Arrow/Enter/Escape navigate.
 *
 * Renders its listbox directly into an {@link Overlay} (`anchored`, matchWidth,
 * focus the search input on open).
 */
export function Combobox({
  options = [],
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Select…',
  emptyText = 'No results',
  disabled = false,
  className,
  ...rest
}: ComboboxProps): ReactElement {
  const [val, setVal] = useControllableState<string>({ value, defaultValue, onChange: onValueChange });
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const norm: ComboboxOption[] = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const selected = norm.find((o) => o.value === val);
  const list = useSearchableList<ComboboxOption>({
    items: norm,
    itemText: (o) => o.label,
    onPick: (o) => { setVal(o.value); setOpen(false); },
  });

  return (
    <div className={cx('rdz-combobox', className)} {...rest}>
      <button
        ref={anchorRef}
        type="button"
        className="rdz-input rdz-combobox__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => { setOpen((o) => !o); list.reset(); }}
      >
        <span className={selected ? undefined : 'rdz-combobox__ph'}>{selected ? selected.label : placeholder}</span>
        <Icon name="chevron-down" size="1em" className="rdz-combobox__chev" />
      </button>
      <Overlay
        open={open}
        onDismiss={() => setOpen(false)}
        position={{ kind: 'anchored', anchor: anchorRef, side: 'bottom', align: 'start', matchWidth: true }}
        ignore={anchorRef}
        focus="auto"
        initialFocus={searchRef}
        className="rdz-combobox__pop"
      >
        <Search
          ref={searchRef}
          variant="plain"
          size="sm"
          placeholder="Search…"
          {...list.inputProps}
        />
        <div className="rdz-combobox__list rdz-scrollbar" {...list.listProps}>
          {list.filtered.length ? list.filtered.map((o, i) => (
            <button
              key={o.value}
              type="button"
              aria-selected={o.value === val}
              className="rdz-combobox__opt"
              {...list.optionProps(i)}
            >
              <span>{o.label}</span>
              {o.value === val ? <Icon name="check" size="1em" /> : null}
            </button>
          )) : <div className="rdz-combobox__empty">{emptyText}</div>}
        </div>
      </Overlay>
    </div>
  );
}
