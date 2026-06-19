import { useRef } from 'react';
import type { HTMLAttributes, ReactNode, ReactElement } from 'react';
import { useControllableState } from '../../internal';
import { MenuSurface } from '../MenuSurface/MenuSurface';
import type { MenuItem } from '../MenuSurface/MenuSurface';

export type { MenuItem } from '../MenuSurface/MenuSurface';

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
  const [open, setOpen] = useControllableState<boolean>({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const anchorRef = useRef<HTMLSpanElement>(null);
  return (
    <span className="srx-dropdown-menu__root">
      <span ref={anchorRef} className="srx-dropdown-menu__anchor" onClick={() => setOpen(!open)}>{trigger}</span>
      <MenuSurface
        open={open}
        onDismiss={() => setOpen(false)}
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
