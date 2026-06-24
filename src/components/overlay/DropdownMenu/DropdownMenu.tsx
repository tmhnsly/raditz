'use client';
import type { HTMLAttributes, ReactNode, ReactElement } from 'react';
import { useTrigger } from '../../internal';
import { MenuSurface } from '../../internal/MenuSurface/MenuSurface';
import type { MenuItem } from '../../internal/MenuSurface/MenuSurface';

export type { MenuItem } from '../../internal/MenuSurface/MenuSurface';

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger element (click toggles the menu). */
  trigger?: ReactNode;
  /** Menu rows — items, `{separator:true}`, or `{heading:true,label}`. */
  items?: MenuItem[];
  /** Preferred side. @default "bottom" */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Cross-axis alignment. @default "start" */
  align?: 'start' | 'center' | 'end';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * DropdownMenu — a button-triggered menu (Radix DropdownMenu). Items are
 * `{ label, icon?, shortcut?, onSelect?, disabled?, danger? }`, plus
 * `{ separator: true }` and `{ heading: true, label }`. Arrow keys move focus,
 * Enter selects, Escape closes.
 *
 * An adapter face: the trigger lives here; {@link MenuSurface} owns positioning,
 * dismissal, roving, and item rendering.
 */
export function DropdownMenu({
  trigger,
  items = [],
  side = 'bottom',
  align = 'start',
  className,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...rest
}: DropdownMenuProps): ReactElement {
  const { open, toggle, close, anchorRef } = useTrigger<HTMLSpanElement>({ open: openProp, defaultOpen, onOpenChange });
  return (
    <span className="rdz-dropdown-menu__root">
      <span ref={anchorRef} className="rdz-dropdown-menu__anchor" onClick={toggle}>{trigger}</span>
      <MenuSurface
        open={open}
        onDismiss={close}
        items={items}
        anchor={anchorRef}
        ignore={anchorRef}
        side={side}
        align={align}
        className={className}
        {...rest}
      />
    </span>
  );
}
