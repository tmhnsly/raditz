import { useState } from 'react';
import type { HTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode, ReactElement } from 'react';
import { MenuSurface } from '../MenuSurface/MenuSurface';
import type { MenuItem } from '../MenuSurface/MenuSurface';

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu rows — same model as DropdownMenu. */
  items?: MenuItem[];
  /** The area that responds to right-click. */
  children?: ReactNode;
}

/**
 * ContextMenu — a right-click menu over an area (Radix ContextMenu). Wrap the
 * target with this; right-clicking it opens the same menu model as DropdownMenu
 * at the cursor. Items: `{ label, icon?, shortcut?, onSelect?, disabled?, danger? }`,
 * plus `{ separator: true }` and `{ heading: true, label }`.
 *
 * An adapter face over {@link MenuSurface} (`point` topology) — so it now shares
 * keyboard roving with the other menus.
 */
export function ContextMenu({ items = [], children, className, ...rest }: ContextMenuProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [pt, setPt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const onContextMenu = (e: ReactMouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setPt({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  return (
    <div onContextMenu={onContextMenu} {...rest}>
      {children}
      <MenuSurface
        open={open}
        onDismiss={() => setOpen(false)}
        items={items}
        point={pt}
        className={className}
      />
    </div>
  );
}
