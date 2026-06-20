import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactNode, ReactElement } from 'react';
import { MenuSurface } from '../MenuSurface/MenuSurface';
import type { MenuItem } from '../MenuSurface/MenuSurface';

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu rows — same model as DropdownMenu. */
  items?: MenuItem[];
  /** The area that responds to right-click / long-press. */
  children?: ReactNode;
  /** Touch press-and-hold duration (ms) that opens the menu. @default 480 */
  longPressMs?: number;
}

/**
 * ContextMenu — a right-click (desktop) / long-press (touch) menu over an area
 * (Radix ContextMenu). Wrap the target; right-click or press-and-hold opens the
 * same menu model as DropdownMenu at the pointer. Items: `{ label, icon?,
 * shortcut?, onSelect?, disabled?, danger? }`, plus `{ separator: true }` and
 * `{ heading: true, label }`.
 *
 * An adapter face over {@link MenuSurface} (`point` topology) — so it shares
 * keyboard roving with the other menus.
 */
export function ContextMenu({ items = [], children, className, longPressMs = 480, ...rest }: ContextMenuProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [pt, setPt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);

  const openAt = (x: number, y: number): void => { setPt({ x, y }); setOpen(true); };
  const clearTimer = (): void => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };

  const onContextMenu = (e: ReactMouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    openAt(e.clientX, e.clientY);
  };

  // Touch: press-and-hold (without moving) opens the menu at the touch point.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
    if (e.pointerType !== 'touch') return;
    start.current = { x: e.clientX, y: e.clientY };
    suppressClick.current = false;
    clearTimer();
    timer.current = setTimeout(() => {
      timer.current = null;
      suppressClick.current = true;
      if (start.current) openAt(start.current.x, start.current.y);
    }, longPressMs);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>): void => {
    if (!start.current) return;
    if (Math.abs(e.clientX - start.current.x) + Math.abs(e.clientY - start.current.y) > 10) clearTimer();
  };
  const endPress = (): void => { clearTimer(); start.current = null; };
  // Swallow the tap that fires after a long-press so it doesn't also activate the target.
  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>): void => {
    if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false; }
  };
  // Clear a pending long-press timer if the target unmounts mid-press.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div
      className="srx-contextmenu"
      onContextMenu={onContextMenu}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPress}
      onPointerCancel={endPress}
      onClickCapture={onClickCapture}
      {...rest}
    >
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
