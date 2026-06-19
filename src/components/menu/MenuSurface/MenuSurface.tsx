import { useEffect, useRef } from 'react';
import type { Dispatch, HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, MutableRefObject, ReactNode, ReactElement, RefObject, SetStateAction } from 'react';
import { cx, Overlay, useRovingMenu } from '../../internal';
import type { Side, Align } from '../../internal';

export interface MenuItem {
  label?: ReactNode;
  icon?: ReactNode;
  shortcut?: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  heading?: boolean;
  /** Submenu items (reserved — not yet rendered). */
  items?: MenuItem[];
}

type RenderPlan =
  | { kind: 'sep'; idx: number }
  | { kind: 'heading'; idx: number; it: MenuItem }
  | { kind: 'item'; idx: number; it: MenuItem; rove: number };

function buildPlan(items: MenuItem[]): { plan: RenderPlan[]; enabledCount: number } {
  let enabledCount = 0;
  const plan: RenderPlan[] = items.map((it, idx) => {
    if (it.separator) return { kind: 'sep', idx };
    if (it.heading) return { kind: 'heading', idx, it };
    const rove = it.disabled ? -1 : enabledCount;
    if (!it.disabled) enabledCount += 1;
    return { kind: 'item', idx, it, rove };
  });
  return { plan, enabledCount };
}

export interface MenuRoving {
  plan: RenderPlan[];
  active: number;
  setActive: Dispatch<SetStateAction<number>>;
  onKeyDown: (e: ReactKeyboardEvent) => void;
  itemRefs: MutableRefObject<(HTMLButtonElement | null)[]>;
  choose: (it: MenuItem) => void;
}

/**
 * Shared menu behavior: builds the render plan, drives roving keyboard nav over
 * enabled items, focuses the active item, and selects (skipping disabled).
 * Used by every menu surface so DropdownMenu, ContextMenu, and Menubar behave
 * identically.
 */
export function useMenuRoving(items: MenuItem[], open: boolean, onClose: () => void): MenuRoving {
  const { plan, enabledCount } = buildPlan(items);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { active, setActive, onKeyDown } = useRovingMenu(enabledCount, open, onClose);

  useEffect(() => { if (open) setActive(0); }, [open, setActive]);
  useEffect(() => {
    if (open && active >= 0) itemRefs.current[active]?.focus({ preventScroll: true });
  }, [active, open]);

  const choose = (it: MenuItem): void => { if (!it.disabled) { if (it.onSelect) it.onSelect(); onClose(); } };
  return { plan, active, setActive, onKeyDown, itemRefs, choose };
}

export interface MenuItemsProps {
  roving: MenuRoving;
}

/** Renders the menu rows from a {@link MenuRoving} plan — the one definition of
 * what a menu item looks like (separator / heading / icon + text + shortcut). */
export function MenuItems({ roving }: MenuItemsProps): ReactElement {
  const { plan, setActive, itemRefs, choose } = roving;
  return (
    <>
      {plan.map((p) => {
        if (p.kind === 'sep') return <div key={p.idx} className="srx-menu__sep" role="separator" />;
        if (p.kind === 'heading') return <div key={p.idx} className="srx-menu__label">{p.it.label}</div>;
        const { it, rove } = p;
        return (
          <button
            key={p.idx}
            type="button"
            role="menuitem"
            disabled={it.disabled}
            ref={(el) => { if (rove >= 0) itemRefs.current[rove] = el; }}
            className={cx('srx-menu__item', it.danger && 'srx-menu__item--danger')}
            onMouseEnter={() => { if (rove >= 0) setActive(rove); }}
            onClick={() => choose(it)}
          >
            {it.icon ? <span className="srx-menu__icon">{it.icon}</span> : null}
            <span className="srx-menu__text">{it.label}</span>
            {it.shortcut ? <span className="srx-menu__shortcut">{it.shortcut}</span> : null}
          </button>
        );
      })}
    </>
  );
}

export interface MenuSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onDismiss: () => void;
  items: MenuItem[];
  /** Anchor element for trigger-anchored menus (DropdownMenu, Menubar). */
  anchor?: RefObject<HTMLElement | null>;
  /** Pointer coordinates for pointer-anchored menus (ContextMenu). */
  point?: { x: number; y: number };
  side?: Side;
  align?: Align;
  /** Trigger to exclude from outside-click. */
  ignore?: RefObject<HTMLElement | null>;
}

/**
 * MenuSurface — a positioned, dismissable, roving menu. Layers shared menu
 * behavior ({@link useMenuRoving}) and rendering ({@link MenuItems}) inside an
 * {@link Overlay} (`anchored` for triggers, `point` for context menus). The
 * adapter faces (DropdownMenu, ContextMenu, Menubar) supply items + a trigger.
 */
export function MenuSurface({
  open,
  onDismiss,
  items,
  anchor,
  point,
  side = 'bottom',
  align = 'start',
  ignore,
  className,
  ...rest
}: MenuSurfaceProps): ReactElement | null {
  const roving = useMenuRoving(items, open, onDismiss);
  const position = point
    ? ({ kind: 'point', x: point.x, y: point.y } as const)
    : ({ kind: 'anchored', anchor: anchor as RefObject<HTMLElement | null>, side, align } as const);
  return (
    <Overlay
      open={open}
      onDismiss={onDismiss}
      position={position}
      ignore={ignore}
      focus="none"
      role="menu"
      className={cx('srx-menu', className)}
      onKeyDown={roving.onKeyDown}
      {...rest}
    >
      <MenuItems roving={roving} />
    </Overlay>
  );
}
