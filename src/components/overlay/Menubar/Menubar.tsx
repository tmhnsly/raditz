'use client';
import { useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, ReactElement } from 'react';
import { cx, useDismiss } from '../../internal';
import { useMenuRoving, MenuItems } from '../../internal/MenuSurface/MenuSurface';
import type { MenuItem } from '../../internal/MenuSurface/MenuSurface';

export interface MenubarMenu {
  label: ReactNode;
  items: MenuItem[];
}

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  /** Top-level menus, each with its own item list. */
  menus?: MenubarMenu[];
}

/** The open menu's panel: inline (CSS-anchored under its trigger) but using the
 * shared roving + item rendering, so Menubar gets keyboard nav like the others. */
function MenubarPanel({ items, onClose }: { items: MenuItem[]; onClose: () => void }): ReactElement {
  const roving = useMenuRoving(items, true, onClose);
  return (
    <div className="rdz-menu rdz-menu--anchored" role="menu" onKeyDown={roving.onKeyDown}>
      <MenuItems roving={roving} />
    </div>
  );
}

/**
 * Menubar — a horizontal row of menus (Radix Menubar), like an app menu bar.
 * `menus` is `[{ label, items }]` where `items` use the DropdownMenu model
 * (`{ label, icon?, shortcut?, onSelect?, disabled?, danger? }`, `{ separator }`,
 * `{ heading, label }`). Once a menu is open, hovering siblings switches to them.
 */
export function Menubar({ menus = [], className, ...rest }: MenubarProps): ReactElement {
  const [openIdx, setOpenIdx] = useState(-1);
  const barRef = useRef<HTMLDivElement>(null);
  useDismiss(barRef, openIdx >= 0, () => setOpenIdx(-1), { ignoreRef: barRef });

  return (
    <div className={cx('rdz-menubar', className)} role="menubar" ref={barRef} {...rest}>
      {menus.map((m, i) => (
        <div key={i} className="rdz-menubar__group">
          <button
            type="button"
            className="rdz-menubar__trigger"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={openIdx === i}
            data-state={openIdx === i ? 'on' : 'off'}
            onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            onMouseEnter={() => { if (openIdx >= 0) setOpenIdx(i); }}
          >
            {m.label}
          </button>
          {openIdx === i ? <MenubarPanel items={m.items || []} onClose={() => setOpenIdx(-1)} /> : null}
        </div>
      ))}
    </div>
  );
}
