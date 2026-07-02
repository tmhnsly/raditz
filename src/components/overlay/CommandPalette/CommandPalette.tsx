'use client';
import { Fragment, useEffect, useMemo } from 'react';
import type { HTMLAttributes, ReactNode, ReactElement } from 'react';
import { cx, Overlay, useSearchableList } from '../../internal';
import { Icon } from '../../display/Icon/Icon';
import { Search } from '../../inputs/Search/Search';
import type { IconName } from '../../display/Icon/Icon';

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
  const close = (): void => { if (onOpenChange) onOpenChange(false); };

  const flat = useMemo<FlatItem[]>(() => {
    const out: FlatItem[] = [];
    groups.forEach((g) => (g.items || []).forEach((it) => out.push({ ...it, heading: g.heading })));
    return out;
  }, [groups]);
  const list = useSearchableList<FlatItem>({
    items: flat,
    itemText: (it) => `${it.label} ${it.keywords || ''}`,
    onPick: (it) => { if (it.onSelect) it.onSelect(); close(); },
  });

  useEffect(() => {
    if (!hotkey) return undefined;
    const h = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (onOpenChange) onOpenChange(!open); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [hotkey, open, onOpenChange]);

  const { reset } = list;
  useEffect(() => { if (open) reset(); }, [open, reset]);

  let lastHeading: ReactNode = null;
  return (
    <Overlay
      open={!!open}
      onDismiss={close}
      position={{ kind: 'centered' }}
      containerClassName="rdz-overlay--cmd"
      focus="trap"
      role="dialog"
      aria-label="Command palette"
      className={cx('rdz-cmdk', className)}
      {...rest}
    >
      <Search
        variant="plain"
        placeholder={placeholder}
        hint={<kbd className="rdz-kbd">esc</kbd>}
        {...list.inputProps}
      />
      <div className="rdz-cmdk__list rdz-scrollbar" {...list.listProps}>
        {list.filtered.length ? list.filtered.map((it, i) => {
          const showHeading = it.heading && it.heading !== lastHeading;
          lastHeading = it.heading;
          return (
            <Fragment key={it.id || i}>
              {showHeading ? <div className="rdz-cmdk__heading" role="presentation">{it.heading}</div> : null}
              <button
                type="button"
                className="rdz-cmdk__item"
                aria-selected={i === list.active}
                {...list.optionProps(i)}
              >
                {it.icon ? <Icon name={it.icon} size="1.05rem" className="rdz-cmdk__icon" /> : null}
                <span className="rdz-cmdk__label">{it.label}</span>
                {it.shortcut ? <kbd className="rdz-kbd">{it.shortcut}</kbd> : null}
              </button>
            </Fragment>
          );
        }) : <div className="rdz-cmdk__empty">No results for “{list.query}”</div>}
      </div>
    </Overlay>
  );
}
