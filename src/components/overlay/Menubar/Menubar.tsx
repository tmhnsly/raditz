'use client';
import { useEffect, useRef } from 'react';
import type { HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, ReactNode, ReactElement } from 'react';
import { cx, KEYS, useControllableState, useDismiss } from '../../internal';
import { useMenuRoving, MenuItems } from '../../internal/MenuSurface/MenuSurface';
import type { MenuItem } from '../../internal/MenuSurface/MenuSurface';

export interface MenubarMenu {
  label: ReactNode;
  items: MenuItem[];
}

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  /** Top-level menus, each with its own item list. */
  menus?: MenubarMenu[];
  /** Index of the open menu (controlled); -1 = all closed. */
  open?: number;
  /** Initially open menu index (uncontrolled). @default -1 (all closed) */
  defaultOpen?: number;
  /** Fires with the newly open menu's index (-1 when closing). */
  onOpenChange?: (openIndex: number) => void;
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
 * `{ heading, label }`). Once a menu is open, hovering siblings switches to them,
 * and ArrowLeft/ArrowRight move between menus. Open state may be controlled
 * (`open` / `onOpenChange`, the open menu's index) or uncontrolled (`defaultOpen`).
 */
export function Menubar({ menus = [], className, open, defaultOpen = -1, onOpenChange, ...rest }: MenubarProps): ReactElement {
  // Open state is the open menu's INDEX (-1 = closed), not a boolean — deliberately hand-wired, not useOpenState.
  const [openIdx, setOpenIdx] = useControllableState<number>({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const barRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useDismiss(barRef, openIdx >= 0, () => setOpenIdx(-1), { ignoreRef: barRef });

  // Focus return: closing a menu (Escape / item select) unmounts the focused
  // menuitem, stranding focus on <body>. Reclaim it for the menu's trigger —
  // as an effect (not in the close handler) because Escape arrives through
  // useDismiss's document-capture listener, which stops propagation before any
  // panel handler could run. Skips when focus already landed elsewhere.
  const lastOpen = useRef(-1);
  useEffect(() => {
    if (openIdx >= 0) { lastOpen.current = openIdx; return; }
    if (lastOpen.current < 0) return;
    const i = lastOpen.current;
    lastOpen.current = -1;
    const active = document.activeElement;
    // Stranded on <body>, or still inside the closing menu — reclaim for the trigger.
    if (active && active !== document.body && !active.closest('[role="menu"]')) return;
    triggerRefs.current[i]?.focus({ preventScroll: true });
  }, [openIdx]);

  // ArrowLeft/ArrowRight move across the bar: between triggers when closed,
  // between open menus when a panel is showing. The panel's roving is vertical,
  // so horizontal arrows bubble up to the bar untouched.
  const onBarKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (e.key !== KEYS.ArrowLeft && e.key !== KEYS.ArrowRight) return;
    const n = menus.length;
    if (!n) return;
    e.preventDefault();
    const delta = e.key === KEYS.ArrowRight ? 1 : -1;
    const from = openIdx >= 0 ? openIdx : triggerRefs.current.findIndex((b) => !!b && b === document.activeElement);
    const next = from < 0 ? (delta === 1 ? 0 : n - 1) : (from + delta + n) % n;
    triggerRefs.current[next]?.focus({ preventScroll: true });
    if (openIdx >= 0) setOpenIdx(next);
  };

  return (
    <div className={cx('rdz-menubar', className)} role="menubar" ref={barRef} onKeyDown={onBarKeyDown} {...rest}>
      {menus.map((m, i) => (
        <div key={i} className="rdz-menubar__group">
          <button
            type="button"
            ref={(el) => { triggerRefs.current[i] = el; }}
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
