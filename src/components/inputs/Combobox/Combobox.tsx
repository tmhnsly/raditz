'use client';
import { useId, useRef, useState } from 'react';
import type { ChangeEvent, HTMLAttributes, KeyboardEvent, ReactElement } from 'react';
import { cx, useControllableState, Overlay, useRoving, fuzzyFilter } from '../../internal';
import { Icon } from '../../display/Icon/Icon';
import { Search } from '../Search/Search';

export interface ComboboxOption { value: string; label: string; }
export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options?: Array<ComboboxOption | string>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

/**
 * Combobox — a searchable single-select. `options` is `[{ value, label }]` (or
 * plain strings). Controlled with `value` / `onChange`, or uncontrolled with
 * `defaultValue`. Type to filter; Arrow/Enter/Escape navigate.
 *
 * Renders its listbox directly into an {@link Overlay} (`anchored`, matchWidth,
 * focus the search input on open).
 */
export function Combobox({
  options = [],
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Select…',
  emptyText = 'No results',
  disabled = false,
  className,
  ...rest
}: ComboboxProps): ReactElement {
  const [val, setVal] = useControllableState<string>({ value, defaultValue, onChange });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const anchorRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const norm: ComboboxOption[] = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const selected = norm.find((o) => o.value === val);
  const filtered = fuzzyFilter(norm, query, (o) => o.label);
  const choose = (o: ComboboxOption): void => { setVal(o.value); setOpen(false); setQuery(''); };

  const { active, setActive, onKeyDown: onKey } = useRoving({
    count: filtered.length,
    orientation: 'vertical',
    loop: false,
    onSelect: (i) => { if (filtered[i]) choose(filtered[i]); },
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
        onClick={() => { setOpen((o) => !o); setActive(0); }}
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
          value={query}
          placeholder="Search…"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={filtered[active] ? `${listId}-o-${active}` : undefined}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setActive(0); }}
          onKeyDown={onKey}
        />
        <div className="rdz-combobox__list rdz-scrollbar" id={listId} role="listbox">
          {filtered.length ? filtered.map((o, i) => (
            <button
              key={o.value}
              id={`${listId}-o-${i}`}
              type="button"
              role="option"
              aria-selected={o.value === val}
              className="rdz-combobox__opt"
              data-active={i === active ? 'true' : undefined}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o)}
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
