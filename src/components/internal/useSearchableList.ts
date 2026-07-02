'use client';
import { useCallback, useState } from 'react';
import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { fuzzyFilter } from './fuzzy';
import { useRoving } from './keyboard';
import { useStableId } from './primitiveUtils';

// The searchable-listbox wiring shared by Combobox and CommandPalette: one
// query state feeding fuzzyFilter, one useRoving highlight that resets on
// typing, and the combobox → listbox → option aria contract (role/ids/
// aria-activedescendant) so both faces stay screen-reader-correct instead of
// re-wiring (and drifting) it per component. Faces own rendering: they spread
// `inputProps` / `listProps` / `optionProps(i)` onto their own markup.

export interface UseSearchableListOptions<T> {
  /** The unfiltered items. */
  items: T[];
  /** Text each item is fuzzy-matched against. */
  itemText: (item: T) => string;
  /** Fired when an item is picked (Enter/Space on the input, or option click). */
  onPick: (item: T, index: number) => void;
}

export interface SearchableListInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: ReactKeyboardEvent) => void;
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-controls': string;
  'aria-autocomplete': 'list';
  'aria-activedescendant': string | undefined;
}

export interface SearchableListOptionProps {
  id: string;
  role: 'option';
  'data-active': 'true' | undefined;
  onMouseEnter: () => void;
  onClick: () => void;
}

export interface SearchableList<T> {
  query: string;
  /** Items fuzzy-filtered by the current query (best match first). */
  filtered: T[];
  /** Index of the highlighted option within `filtered`. */
  active: number;
  /** Clear the query and re-highlight the first item — call when (re)opening. Stable identity. */
  reset: () => void;
  /** Spread onto the search input. */
  inputProps: SearchableListInputProps;
  /** Spread onto the listbox container. */
  listProps: { id: string; role: 'listbox' };
  /** Spread onto the option at `index`. */
  optionProps: (index: number) => SearchableListOptionProps;
}

export function useSearchableList<T>({ items, itemText, onPick }: UseSearchableListOptions<T>): SearchableList<T> {
  const [query, setQuery] = useState('');
  const listId = useStableId('rdz-list');
  const filtered = fuzzyFilter(items, query, itemText);

  function pick(index: number): void {
    const item = filtered[index];
    if (!item) return;
    onPick(item, index);
    setQuery('');
    setActive(0);
  }

  const { active, setActive, onKeyDown } = useRoving({
    count: filtered.length,
    orientation: 'vertical',
    loop: false,
    onSelect: pick,
  });

  const reset = useCallback((): void => { setQuery(''); setActive(0); }, [setActive]);

  return {
    query,
    filtered,
    active,
    reset,
    inputProps: {
      value: query,
      onChange: (e) => { setQuery(e.target.value); setActive(0); },
      onKeyDown,
      role: 'combobox',
      // The faces only mount the input while their popover is open.
      'aria-expanded': true,
      'aria-controls': listId,
      'aria-autocomplete': 'list',
      'aria-activedescendant': filtered[active] ? `${listId}-o-${active}` : undefined,
    },
    listProps: { id: listId, role: 'listbox' },
    optionProps: (index) => ({
      id: `${listId}-o-${index}`,
      role: 'option',
      'data-active': index === active ? 'true' : undefined,
      onMouseEnter: () => setActive(index),
      onClick: () => pick(index),
    }),
  };
}
