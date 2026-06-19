import { Fragment, useState, useEffect, useMemo } from 'react';
import type { HTMLAttributes, ReactNode, ReactElement, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cx, Overlay, useRoving, fuzzyFilter } from '../../internal';
import { Icon } from '../../foundation/Icon/Icon';
import { Search } from '../../forms/Search/Search';
import type { IconName } from '../../foundation/Icon/Icon';

export interface CommandItem {
  id?: string;
  label: ReactNode;
  icon?: IconName;
  shortcut?: ReactNode;
  /** Extra text to match against when filtering. */
  keywords?: string;
  onSelect?: () => void;
}
export interface CommandGroup { heading?: ReactNode; items: CommandItem[]; }
export interface CommandPaletteProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  groups?: CommandGroup[];
  placeholder?: string;
  /** Bind ⌘K / Ctrl-K globally to toggle. @default true */
  hotkey?: boolean;
}

type FlatItem = CommandItem & { heading?: ReactNode };

/**
 * CommandPalette — a ⌘K / Ctrl-K command launcher. `groups` is
 * `[{ heading, items: [{ id, label, icon?, shortcut?, keywords?, onSelect }] }]`.
 * Controlled with `open` / `onOpenChange`. With `hotkey` (default true) it binds
 * ⌘K/Ctrl-K globally to toggle. Type to fuzzy-filter; Arrow/Enter run.
 *
 * An adapter face over {@link Overlay} (`centered` modal, focus trap).
 */
export function CommandPalette({ open, onOpenChange, groups = [], placeholder = 'Type a command or search…', hotkey = true, className, ...rest }: CommandPaletteProps): ReactElement | null {
  const [query, setQuery] = useState('');
  const close = (): void => { if (onOpenChange) onOpenChange(false); };

  const flat = useMemo<FlatItem[]>(() => {
    const out: FlatItem[] = [];
    groups.forEach((g) => (g.items || []).forEach((it) => out.push({ ...it, heading: g.heading })));
    return out;
  }, [groups]);
  const filtered = fuzzyFilter(flat, query, (it) => `${it.label} ${it.keywords || ''}`);
  const run = (it: FlatItem | undefined): void => { if (it) { if (it.onSelect) it.onSelect(); close(); } };

  const { active, setActive, onKeyDown: onKey } = useRoving({
    count: filtered.length,
    orientation: 'vertical',
    loop: false,
    onSelect: (i) => run(filtered[i]),
  });

  useEffect(() => {
    if (!hotkey) return undefined;
    const h = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (onOpenChange) onOpenChange(!open); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [hotkey, open, onOpenChange]);

  useEffect(() => { if (open) { setQuery(''); setActive(0); } }, [open, setActive]);

  let lastHeading: ReactNode = null;
  return (
    <Overlay
      open={!!open}
      onDismiss={close}
      position={{ kind: 'centered' }}
      containerClassName="srx-overlay--cmd"
      focus="trap"
      role="dialog"
      aria-label="Command palette"
      className={cx('srx-cmdk', className)}
      {...rest}
    >
      <Search
        variant="plain"
        value={query}
        placeholder={placeholder}
        hint={<kbd className="srx-kbd">esc</kbd>}
        onChange={(e) => { setQuery(e.target.value); setActive(0); }}
        onKeyDown={onKey}
      />
      <div className="srx-cmdk__list srx-scrollbar">
        {filtered.length ? filtered.map((it, i) => {
          const showHeading = it.heading && it.heading !== lastHeading;
          lastHeading = it.heading;
          return (
            <Fragment key={it.id || i}>
              {showHeading ? <div className="srx-cmdk__heading">{it.heading}</div> : null}
              <button
                type="button"
                className="srx-cmdk__item"
                data-active={i === active ? 'true' : undefined}
                onMouseEnter={() => setActive(i)}
                onClick={() => run(it)}
              >
                {it.icon ? <Icon name={it.icon} size="1.05rem" className="srx-cmdk__icon" /> : null}
                <span className="srx-cmdk__label">{it.label}</span>
                {it.shortcut ? <kbd className="srx-kbd">{it.shortcut}</kbd> : null}
              </button>
            </Fragment>
          );
        }) : <div className="srx-cmdk__empty">No results for “{query}”</div>}
      </div>
    </Overlay>
  );
}
